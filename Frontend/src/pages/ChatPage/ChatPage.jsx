import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scanner } from '@yudiel/react-qr-scanner';
import { apiService } from '../../services/api';
import {
    PanelLeft, SquarePen, Search, FileText, QrCode, Upload,
    Settings, LogOut, Plus, Mic, Headphones, ArrowUp,
    Copy, ThumbsUp, ThumbsDown, Share, RotateCcw, MoreHorizontal,
    ChevronDown, Camera, X, CheckCircle, Sun, Moon, Palette, Sparkles, SunMoon
} from 'lucide-react';
import './ChatPage.css';
import './ChatFuncModals.css';

const LoaderIcon = ({ size = 16 }) => (
    <svg height={size} strokeLinejoin="round" style={{ color: "currentcolor" }} viewBox="0 0 16 16" width={size}>
        <g clipPath="url(#clip0_2393_1490)">
            <path d="M8 0V4" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 16V12" opacity="0.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M3.29773 1.52783L5.64887 4.7639" opacity="0.9" stroke="currentColor" strokeWidth="1.5" />
            <path d="M12.7023 1.52783L10.3511 4.7639" opacity="0.1" stroke="currentColor" strokeWidth="1.5" />
            <path d="M12.7023 14.472L10.3511 11.236" opacity="0.4" stroke="currentColor" strokeWidth="1.5" />
            <path d="M3.29773 14.472L5.64887 11.236" opacity="0.6" stroke="currentColor" strokeWidth="1.5" />
            <path d="M15.6085 5.52783L11.8043 6.7639" opacity="0.2" stroke="currentColor" strokeWidth="1.5" />
            <path d="M0.391602 10.472L4.19583 9.23598" opacity="0.7" stroke="currentColor" strokeWidth="1.5" />
            <path d="M15.6085 10.4722L11.8043 9.2361" opacity="0.3" stroke="currentColor" strokeWidth="1.5" />
            <path d="M0.391602 5.52783L4.19583 6.7639" opacity="0.8" stroke="currentColor" strokeWidth="1.5" />
        </g>
        <defs><clipPath id="clip0_2393_1490"><rect fill="white" height="16" width="16" /></clipPath></defs>
    </svg>
);

const CustomSelect = ({ options, value, onChange, placeholder = "-- Choose --", disabled = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => String(opt.value) === String(value));

    return (
        <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
            <div
                className={`func-input ${disabled ? 'disabled' : ''}`}
                style={{ cursor: disabled ? 'not-allowed' : 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: disabled ? 0.7 : 1 }}
                onClick={() => !disabled && setIsOpen(!isOpen)}
            >
                <span style={{ color: selectedOption ? 'inherit' : '#8e8ea0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown size={16} style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease', flexShrink: 0, marginLeft: 8 }} />
            </div>
            {isOpen && (
                <div className="custom-select-dropdown">
                    <div className="custom-select-option" onClick={() => { onChange(''); setIsOpen(false); }}>
                        {placeholder}
                    </div>
                    {options.map((opt, idx) => (
                        <div key={idx} className="custom-select-option" onClick={() => { onChange(opt.value); setIsOpen(false); }}>
                            {opt.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const ChatPage = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [inputVal, setInputVal] = useState('');
    const [messages, setMessages] = useState([]); // {role: 'user' | 'bot', text: string}
    const [status, setStatus] = useState('ready');
    const [qrModalState, setQrModalState] = useState('closed');
    const [qrData, setQrData] = useState(null);
    const [selectedManual, setSelectedManual] = useState(null);
    const [toastMessage, setToastMessage] = useState('');
    const [activeFuncModal, setActiveFuncModal] = useState(null); // null, 'upload', 'select'
    const [theme, setTheme] = useState('night'); // 'night', 'day', 'warm', 'plum'
    const messagesEndRef = useRef(null);

    // API integration states
    const [userData, setUserData] = useState(null);
    const [userManuals, setUserManuals] = useState([]);
    const [uploadCompany, setUploadCompany] = useState('');
    const [uploadProduct, setUploadProduct] = useState('');
    const [uploadCode, setUploadCode] = useState('');
    const [uploadFile, setUploadFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        // Fetch user data & manuals on mount
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchInitialData = async () => {
            try {
                // Decode username/email from the JWT token (format: { "sub": "email@example.com", ... })
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
                const payload = JSON.parse(jsonPayload);
                const email = payload.sub;
                const username = email ? email.split('@')[0] : 'Guest';
                setUserData({ email, username });
            } catch (error) {
                console.error("Failed to parse user data from token:", error);
                setUserData({ username: 'Guest' });
            }

            try {
                // Fetch both user-uploaded manuals and admin global manuals
                const [userManualsRes, adminManualsRes] = await Promise.all([
                    apiService.getUsersManual(),
                    apiService.getAdminsManual()
                ]);

                const userList = Array.isArray(userManualsRes) ? userManualsRes : [];
                const adminList = Array.isArray(adminManualsRes) ? adminManualsRes : [];

                setUserManuals([...adminList, ...userList]);
            } catch (error) {
                console.error("Failed to fetch manuals:", error);
            }
        };

        fetchInitialData();
    }, [navigate]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(''), 3000);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const handleQRScanClick = () => {
        setQrData(null);
        setQrModalState('start');
    };

    const handleUploadSubmit = async () => {
        if (!uploadCompany || !uploadProduct || !uploadFile) {
            showToast("Company, product and file are required");
            return;
        }
        setIsUploading(true);
        try {
            await apiService.uploadFile(uploadCompany, uploadProduct, uploadCode || '', uploadFile);
            showToast('Manual uploaded successfully!');
            // Refresh manuals (combine admin + user again)
            const [userManualsRes, adminManualsRes] = await Promise.all([
                apiService.getUsersManual(),
                apiService.getAdminsManual()
            ]);
            const userList = Array.isArray(userManualsRes) ? userManualsRes : [];
            const adminList = Array.isArray(adminManualsRes) ? adminManualsRes : [];
            setUserManuals([...adminList, ...userList]);

            setActiveFuncModal(null);

            // clear form
            setUploadCompany('');
            setUploadProduct('');
            setUploadCode('');
            setUploadFile(null);
        } catch (error) {
            showToast(error.message || 'Error uploading file');
        } finally {
            setIsUploading(false);
        }
    };

    const onScanResult = (result) => {
        if (!result) return;

        try {
            // Unpack raw string from scanner result
            let rawText = '';
            if (Array.isArray(result) && result.length > 0) {
                rawText = result[0].rawValue || result[0].text || result[0].data || result[0].value || '';
                if (!rawText) rawText = typeof result[0] === 'object' ? JSON.stringify(result[0]) : String(result[0]);
            } else if (typeof result === 'object') {
                rawText = result.rawValue || result.text || result.data || result.value || '';
                if (!rawText) rawText = JSON.stringify(result);
            } else {
                rawText = String(result);
            }

            // Un-escape quotes if improperly stringified
            if (rawText.startsWith('"') && rawText.endsWith('"')) {
                rawText = rawText.slice(1, -1);
            }

            // Unescape backslashes if present
            rawText = rawText.replace(/\\"/g, '"');

            let parsedData = null;
            try {
                parsedData = JSON.parse(rawText);
            } catch (e) {
                try {
                    // Try to fix single quotes to double quotes for bad JSON strings
                    const relaxedJson = rawText.replace(/'/g, '"').replace(/([a-zA-Z0-9_\-]+)\s*:/g, '"$1":');
                    parsedData = JSON.parse(relaxedJson);
                } catch (e2) {
                    // Not valid JSON
                }
            }

            if (parsedData && typeof parsedData === 'object' && !Array.isArray(parsedData)) {
                // Normalize all keys for case-insensitive and underscore-insensitive matching
                const norm = {};
                for (const k of Object.keys(parsedData)) {
                    const normalizedKey = k.toLowerCase().replace(/[^a-z0-9]/g, '');
                    const val = parsedData[k];
                    norm[normalizedKey] = (val !== null && val !== undefined) ? String(val) : '';
                }

                // Helper to check if a key exists in our normalized dictionary securely
                const findVal = (keys) => {
                    for (const k of keys) {
                        if (norm[k] !== undefined) return norm[k];
                    }
                    return null; // strictly return null only if none of the keys exist
                };

                // Match anything dynamically, regardless of case or underscores!
                const guessCompany = findVal(['company', 'companyname', 'brand', 'manufacturer', 'vendor']);
                const guessProduct = findVal(['product', 'productname', 'name', 'itemname', 'model', 'title']);
                const guessCode = findVal(['code', 'productcode', 'id', 'productid', 'sku', 'serial', 'itemcode']);

                if (guessCompany !== null || guessProduct !== null || guessCode !== null) {
                    setQrData({
                        company: guessCompany || 'Unknown Company',
                        product: guessProduct || 'Unknown Product',
                        code: guessCode || 'N/A'
                    });
                } else {
                    // It's a JSON but has totally different keys. Show all contents
                    let combined = '';
                    for (const [k, v] of Object.entries(parsedData)) { combined += `${k}: ${v} | `; }
                    setQrData({
                        company: 'Scanned Data:',
                        product: combined.trim(),
                        code: 'N/A'
                    });
                }
            } else {
                // It's pure string text, link, or normal text! Show it cleanly!
                setQrData({
                    company: 'Scanned Output:',
                    product: rawText,
                    code: 'N/A'
                });
            }

            setQrModalState('scanned');
            showToast('QR code scanned successfully!');
        } catch (error) {
            console.error('Error processing scan result:', error);
            setQrData({ company: 'Error', product: 'Failed to process', code: String(error) });
            setQrModalState('scanned');
        }
    };

    const handleMockScan = () => {
        setQrData({ company: 'Mock Company', product: 'Mock Product', code: 'MCK-001' });
        setQrModalState('scanned');
        showToast('QR code scanned successfully!');
    };

    const handleLoadManual = () => {
        setSelectedManual(qrData);
        setQrModalState('closed');
        showToast(`QR scanned: ${qrData.company} - ${qrData.product}. Select PDF dialog opened.`);
    };

    const sendMessage = (textToSend) => {
        if (!textToSend.trim() || status === 'streaming') return;

        setMessages(prev => [...prev, { role: 'user', text: textToSend }]);
        setInputVal('');
        setStatus('streaming');

        setTimeout(() => {
            const tempBotMsg = { role: 'bot', text: "" };
            setMessages(prev => [...prev, tempBotMsg]);

            const fullResponse = "Heyy Appu 😊\nLook who showed up. What's going on in that chaotic genius brain today?\n\nDid you come to rant about code, design your Companion AI empire, or just vibe for a bit? Because I'm here for all three. Spill. ☕✨";
            const words = fullResponse.split(" ");
            let currentText = "";

            const streamWord = (index) => {
                if (index < words.length) {
                    currentText += (index > 0 ? " " : "") + words[index];
                    setMessages(prev => {
                        const newMsgs = [...prev];
                        newMsgs[newMsgs.length - 1] = { role: 'bot', text: currentText };
                        return newMsgs;
                    });
                    setTimeout(() => streamWord(index + 1), Math.random() * 50 + 30);
                } else {
                    setStatus('ready');
                }
            };

            streamWord(0);
        }, 600);
    };

    const handleSend = () => sendMessage(inputVal);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const toggleTheme = () => {
        if (theme === 'night') setTheme('day');
        else if (theme === 'day') setTheme('warm');
        else if (theme === 'warm') setTheme('plum');
        else setTheme('night');
    };

    return (
        <div className={`chat-page-container ${theme === 'day' ? 'day-theme' : theme === 'warm' ? 'warm-theme' : theme === 'plum' ? 'plum-theme' : ''}`}>

            {/* Sidebar */}
            <div className={`chat-sidebar ${!sidebarOpen ? 'collapsed' : ''}`}>
                <div className="sidebar-header">
                    <div className="sidebar-brand">
                        <span style={{ fontWeight: 600, visibility: sidebarOpen ? 'visible' : 'hidden' }}>Companion AI</span>
                    </div>
                    <button className="sidebar-toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
                        <PanelLeft size={20} />
                    </button>
                </div>

                <div className="sidebar-nav">
                    <div className="sidebar-item" onClick={() => setMessages([])}>
                        <SquarePen size={18} />
                        <span>New chat</span>
                    </div>
                    <div className="sidebar-item">
                        <Search size={18} />
                        <span>Search manuals</span>
                    </div>
                    <div className="sidebar-item" onClick={() => setActiveFuncModal('select')}>
                        <FileText size={18} />
                        <span>Select PDF</span>
                    </div>
                    <div className="sidebar-item" onClick={handleQRScanClick}>
                        <QrCode size={18} />
                        <span>QR Scan</span>
                    </div>
                    <div className="sidebar-item" onClick={() => setActiveFuncModal('upload')}>
                        <Upload size={18} />
                        <span>Upload PDF</span>
                    </div>
                </div>

                <div className="sidebar-footer">
                    <div className="user-profile">
                        <div className="user-avatar" style={{ backgroundColor: '#a17ff7' }}>
                            {userData?.username ? userData.username.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div className="user-info">
                            <span className="user-name">{userData?.username || 'Guest'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main chat area */}
            <div className={`chat-main ${messages.length === 0 ? 'is-empty' : ''}`}>
                {/* Chat Header */}
                <div className="chat-header">
                    <div className="chat-header-left" style={{ marginLeft: '12px' }}>
                        {selectedManual && (
                            <button className="manual-selector-btn" onClick={() => setActiveFuncModal('select')}>
                                <span style={{ fontWeight: 600, color: '#ececf1', fontSize: '18px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    {selectedManual.product}
                                </span>
                                <span style={{ color: '#8e8ea0', marginLeft: '6px', fontSize: '18px' }}>
                                    {selectedManual.code || selectedManual.company}
                                </span>
                                <ChevronDown size={20} style={{ marginLeft: '8px', color: '#8e8ea0' }} />
                            </button>
                        )}
                    </div>
                    <div className="chat-header-right">
                        <button className="header-btn" onClick={toggleTheme} title="Toggle Theme">
                            {theme === 'night' ? <Sun size={16} /> : theme === 'day' ? <Palette size={16} /> : theme === 'warm' ? <SunMoon size={16} /> : <Moon size={16} />}
                        </button>
                        <button className="header-btn" onClick={handleLogout} title="Logout">
                            <LogOut size={16} />
                        </button>
                    </div>
                </div>

                {/* Chat Content */}
                <div className="chat-content-wrapper">
                    {messages.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-title">What can I help with, {userData?.username}?</div>
                            <div style={{ color: '#8e8ea0', fontSize: '14px', marginBottom: '16px' }}>Ask questions about your manuals • {userManuals?.length || 0} manuals available</div>
                        </div>
                    ) : (
                        <div className="chat-messages">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`message-row ${msg.role === 'user' ? 'message-user' : 'message-assistant'}`}>
                                    {msg.role === 'user' ? (
                                        <div className="message-bubble">{msg.text}</div>
                                    ) : (
                                        <div className="message-bubble-container">

                                            <div className="message-bubble" style={{ whiteSpace: 'pre-wrap' }}>
                                                {msg.text || (
                                                    <div className="spinner" style={{ padding: '4px 0' }}>
                                                        <LoaderIcon size={20} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="message-actions">
                                                <button className="message-action-btn"><Copy size={16} /></button>
                                                <button className="message-action-btn"><ThumbsUp size={16} /></button>
                                                <button className="message-action-btn"><ThumbsDown size={16} /></button>
                                                <button className="message-action-btn"><Upload size={16} /></button>
                                                <button className="message-action-btn"><RotateCcw size={16} /></button>
                                                <button className="message-action-btn"><MoreHorizontal size={16} /></button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="input-area-container">
                    <div className="chat-input-box">
                        <button className="chat-input-attach">
                            <Plus size={20} />
                        </button>
                        <input
                            type="text"
                            className="chat-input-field"
                            placeholder="Ask anything"
                            value={inputVal}
                            onChange={(e) => setInputVal(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <div className="chat-input-actions">
                            {inputVal.trim().length > 0 ? (
                                <button className="chat-send-btn" onClick={handleSend} style={{ backgroundColor: '#ffffff', color: '#000000' }}>
                                    <ArrowUp size={18} strokeWidth={2.5} style={{ stroke: '#000000' }} />
                                </button>
                            ) : (
                                <button className="chat-send-btn" style={{ backgroundColor: '#ffffff', color: '#000000', opacity: 0.3, cursor: 'not-allowed' }}>
                                    <ArrowUp size={18} strokeWidth={2.5} style={{ stroke: '#000000' }} />
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="chat-disclaimer">
                        Companion AI can make mistakes. Check important info.
                    </div>
                </div>

            </div>

            {/* Modal injection */}
            {qrModalState !== 'closed' && (
                <div className="qr-modal-overlay" onClick={() => setQrModalState('closed')}>
                    <div className="qr-modal" onClick={e => e.stopPropagation()}>
                        <div className="qr-modal-header">
                            <span>{qrModalState === 'select-pdf' ? 'Select PDF Manual' : 'QR Code Scanner'}</span>
                            <button className="qr-modal-close" onClick={() => setQrModalState('closed')}><X size={20} /></button>
                        </div>

                        <div className="qr-modal-content">
                            {qrModalState === 'start' && (
                                <>
                                    <Camera size={48} strokeWidth={1.5} style={{ opacity: 0.5, marginBottom: 8 }} />
                                    <div className="qr-info-text">Scan a QR code containing product information</div>
                                    <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                                        <button className="qr-start-btn" onClick={() => setQrModalState('scanning')}>Start Camera</button>
                                        <button className="qr-stop-btn" onClick={handleMockScan}>Mock Scan (Dev)</button>
                                    </div>
                                </>
                            )}

                            {qrModalState === 'scanning' && (
                                <>
                                    <div className="qr-scanner-box">
                                        <Scanner onScan={onScanResult} onError={console.error} components={{ audio: false }} />
                                    </div>
                                    <div className="qr-info-text">Point camera at QR code</div>
                                    <button className="qr-stop-btn" style={{ marginTop: 8 }} onClick={() => setQrModalState('closed')}>Stop Scanning</button>
                                </>
                            )}

                            {qrModalState === 'scanned' && qrData && (
                                <>
                                    <div className="qr-success-box">
                                        <div className="qr-success-header">
                                            <CheckCircle size={18} />
                                            QR Code Scanned Successfully!
                                        </div>
                                        <div className="qr-row">Company: {qrData.company}</div>
                                        <div className="qr-row">Product: {qrData.product}</div>
                                        <div className="qr-row">Product Code: {qrData.code}</div>
                                    </div>
                                    <div className="modal-actions">
                                        <button className="qr-start-btn" style={{ flex: 1 }} onClick={handleLoadManual}>Use This Data</button>
                                        <button className="qr-stop-btn" style={{ flex: 1 }} onClick={() => setQrModalState('scanning')}>Scan Again</button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {activeFuncModal === 'upload' && (
                <div className="func-modal-overlay" onClick={() => setActiveFuncModal(null)}>
                    <div className="func-modal" onClick={e => e.stopPropagation()}>
                        <div className="func-modal-header">
                            <h2>Upload Your PDF Manual</h2>
                            <button className="func-close-btn" onClick={() => setActiveFuncModal(null)}>
                                <X size={24} />
                            </button>
                        </div>
                        <div className="func-modal-body">
                            <div className="func-input-group">
                                <label>Company name</label>
                                <input type="text" className="func-input" placeholder="Enter company name" value={uploadCompany} onChange={(e) => setUploadCompany(e.target.value)} disabled={isUploading} />
                            </div>
                            <div className="func-dropzone" onClick={() => document.getElementById('fileUpload').click()} style={{ cursor: 'pointer' }}>
                                <Upload size={32} strokeWidth={1.5} color="#8e8ea0" />
                                <span>{uploadFile ? uploadFile.name : 'Click to upload PDF'}</span>
                                <input id="fileUpload" type="file" accept=".pdf" style={{ display: 'none' }} onChange={(e) => setUploadFile(e.target.files[0])} disabled={isUploading} />
                            </div>
                            <div className="func-input-group">
                                <label>Product Name</label>
                                <input type="text" className="func-input" placeholder="Enter product name" value={uploadProduct} onChange={(e) => setUploadProduct(e.target.value)} disabled={isUploading} />
                            </div>
                            <div className="func-input-group">
                                <label>Product Code (Optional)</label>
                                <input type="text" className="func-input" placeholder="Enter product code" value={uploadCode} onChange={(e) => setUploadCode(e.target.value)} disabled={isUploading} />
                            </div>
                            <button className="func-submit-btn" onClick={handleUploadSubmit} disabled={isUploading}>
                                {isUploading ? 'Uploading...' : 'Upload and Process'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {activeFuncModal === 'select' && (
                <div className="func-modal-overlay" onClick={() => setActiveFuncModal(null)}>
                    <div className="func-modal" onClick={e => e.stopPropagation()}>
                        <div className="func-modal-header">
                            <h2>Select PDF Manual</h2>
                            <button className="func-close-btn" onClick={() => setActiveFuncModal(null)}>
                                <X size={24} />
                            </button>
                        </div>
                        <div className="func-modal-body">
                            <div className="func-input-group">
                                <label style={{ textTransform: 'uppercase', letterSpacing: '1px', fontSize: '13px' }}>Select a Manual</label>
                                <CustomSelect
                                    options={userManuals?.map((m, i) => ({ value: i, label: `${m.company_name} - ${m.product_name}` })) || []}
                                    value={(() => {
                                        if (!selectedManual) return '';
                                        const idx = userManuals.findIndex(m => m.company_name === selectedManual.company && m.product_name === selectedManual.product);
                                        return idx !== -1 ? idx : '';
                                    })()}
                                    onChange={(val) => {
                                        if (val === '') {
                                            setSelectedManual(null);
                                        } else {
                                            const m = userManuals[val];
                                            if (m) setSelectedManual({ company: m.company_name, product: m.product_name, code: m.file_name });
                                        }
                                    }}
                                />
                            </div>
                            <button className="func-submit-btn" onClick={() => {
                                if (!selectedManual) {
                                    showToast('Please select a manual first!');
                                    return;
                                }
                                showToast('Manual loaded!');
                                setActiveFuncModal(null);
                            }}>
                                <FileText size={18} style={{ marginRight: 8 }} /> Load Manual
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {toastMessage && (
                <div className="toast-msg">
                    <CheckCircle size={18} />
                    {toastMessage}
                </div>
            )}
        </div>
    );
};

export default ChatPage;
