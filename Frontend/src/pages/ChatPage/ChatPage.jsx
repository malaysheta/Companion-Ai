import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scanner } from '@yudiel/react-qr-scanner';
import {
    PanelLeft, SquarePen, Search, FileText, QrCode, Upload,
    Settings, LogOut, Plus, Mic, Headphones, ArrowUp,
    Copy, ThumbsUp, ThumbsDown, Share, RotateCcw, MoreHorizontal,
    ChevronDown, Camera, X, CheckCircle
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
    const messagesEndRef = useRef(null);

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

    const handleQRScanClick = () => {
        setQrData(null);
        setQrModalState('start');
    };

    const onScanResult = (result) => {
        if (result && result.length > 0) {
            setQrData({ company: 'asd', product: 'asd', code: 'asd' }); // Mocked to 'asd' per user screenshot format!
            setQrModalState('scanned');
            showToast('QR code scanned successfully!');
        }
    };

    const handleMockScan = () => {
        setQrData({ company: 'asd', product: 'asd', code: 'asd' });
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

    return (
        <div className="chat-page-container">

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
                        <div className="user-avatar" style={{ backgroundColor: '#a17ff7' }}>A</div>
                        <div className="user-info">
                            <span className="user-name">Apurv Sharma</span>
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
                        <button className="header-btn" onClick={() => navigate('/')}>
                            <LogOut size={16} />
                        </button>
                    </div>
                </div>

                {/* Chat Content */}
                <div className="chat-content-wrapper">
                    {messages.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-title">What can I help with?</div>
                            <div style={{ color: '#8e8ea0', fontSize: '14px', marginBottom: '16px' }}>Ask questions about your manuals • 19 manuals available</div>
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
                                    <div style={{ color: '#ececf1', fontSize: 14 }}>Scan a QR code containing product information</div>
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
                                    <div style={{ color: '#ececf1', fontSize: 14 }}>Point camera at QR code</div>
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
                                        <button className="qr-start-btn" style={{ flex: 1 }} onClick={() => setQrModalState('select-pdf')}>Use This Data</button>
                                        <button className="qr-stop-btn" style={{ flex: 1 }} onClick={() => setQrModalState('scanning')}>Scan Again</button>
                                    </div>
                                </>
                            )}

                            {qrModalState === 'select-pdf' && qrData && (
                                <div style={{ width: '100%' }}>
                                    <div className="qr-form-group">
                                        <label>Company Name</label>
                                        <select defaultValue={qrData.company}>
                                            <option value={qrData.company}>{qrData.company}</option>
                                        </select>
                                    </div>
                                    <div className="qr-form-group">
                                        <label>Product Name</label>
                                        <select defaultValue={qrData.product}>
                                            <option value={qrData.product}>{qrData.product}</option>
                                        </select>
                                    </div>
                                    <div className="qr-form-group">
                                        <label>Product Code (Optional)</label>
                                        <input type="text" defaultValue={qrData.code} />
                                    </div>
                                    <button className="qr-start-btn" style={{ width: '100%', marginTop: 16, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }} onClick={handleLoadManual}>
                                        <FileText size={16} /> Load Manual
                                    </button>
                                </div>
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
                                <input type="text" className="func-input" placeholder="Enter company name" />
                            </div>
                            <div className="func-dropzone">
                                <Upload size={32} strokeWidth={1.5} color="#8e8ea0" />
                                <span>Click to upload PDF</span>
                            </div>
                            <div className="func-input-group">
                                <label>Product Name (Optional)</label>
                                <input type="text" className="func-input" placeholder="Enter product name" />
                            </div>
                            <div className="func-input-group">
                                <label>Product Code (Optional)</label>
                                <input type="text" className="func-input" placeholder="Enter product code" />
                            </div>
                            <button className="func-submit-btn" onClick={() => {
                                showToast('Manual uploaded successfully!');
                                setActiveFuncModal(null);
                            }}>
                                Upload and Process
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
                                <label>Company Name</label>
                                <select className="func-input">
                                    <option>Select a company</option>
                                    <option>Asus</option>
                                    <option>GE</option>
                                    <option>LG</option>
                                    <option>TCL</option>
                                </select>
                            </div>
                            <div className="func-input-group">
                                <label>Product Name</label>
                                <select className="func-input">
                                    <option>Select a product</option>
                                    <option>Fridge</option>
                                    <option>TV</option>
                                    <option>Laptop</option>
                                </select>
                            </div>
                            <div className="func-input-group">
                                <label>Product Code (Optional)</label>
                                <input type="text" className="func-input" placeholder="Enter product code" />
                            </div>
                            <button className="func-submit-btn" onClick={() => {
                                setSelectedManual({ company: 'Asus', product: 'Laptop', code: '123' });
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
