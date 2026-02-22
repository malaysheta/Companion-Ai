import React, { useRef, useEffect } from 'react';

const WarpBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        const stars = [];
        const numStars = 600;
        const speed = 25; // Speed of stars

        // Initialize stars
        const colors = ['#00ffff', '#ffaa00', '#ffffff', '#ff0055', '#3366ff'];
        for (let i = 0; i < numStars; i++) {
            stars.push({
                x: (Math.random() - 0.5) * canvas.width * 2,
                y: (Math.random() - 0.5) * canvas.height * 2,
                z: Math.random() * canvas.width,
                color: colors[Math.floor(Math.random() * colors.length)]
            });
        }

        const draw = () => {
            // Clear with dark background
            ctx.fillStyle = '#0b0b0b';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const cx = canvas.width / 2;
            const cy = canvas.height / 2;

            stars.forEach(star => {
                // Move star closer
                star.z -= speed;

                // Reset if it passes the screen
                if (star.z <= 0) {
                    star.z = canvas.width;
                    star.x = (Math.random() - 0.5) * canvas.width * 2;
                    star.y = (Math.random() - 0.5) * canvas.height * 2;
                }

                // Project 3D coordinates to 2D
                const k = 128.0 / star.z;
                const px = star.x * k + cx;
                const py = star.y * k + cy;

                // Draw only if within bounds (with some margin for warp lines)
                if (px >= -100 && px <= canvas.width + 100 && py >= -100 && py <= canvas.height + 100) {
                    const size = (1 - star.z / canvas.width) * 2.5;

                    // Fade in as they get closer
                    const alpha = (1 - star.z / canvas.width);
                    ctx.globalAlpha = alpha;
                    ctx.strokeStyle = star.color;
                    ctx.lineWidth = size;
                    ctx.lineCap = 'round';

                    // Calculate previous position for trail (warp effect)
                    // The further away (z larger), the less movement in 2D, so shorter trail?
                    // Actually warp lines elongate as they get closer (move faster across screen)
                    // Let's use a dynamic trail length based on z speed
                    const prevZ = star.z + speed * 2;
                    const prevK = 128.0 / prevZ;
                    const prevPx = star.x * prevK + cx;
                    const prevPy = star.y * prevK + cy;

                    ctx.beginPath();
                    ctx.moveTo(px, py);
                    ctx.lineTo(prevPx, prevPy);
                    ctx.stroke();

                    ctx.globalAlpha = 1.0;
                }
            });

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full -z-10"
            style={{ backgroundColor: 'var(--color-background-black, #000)' }}
        />
    );
};

export default WarpBackground;
