// Chain configuration data
const chainConfig = {
    ethereum: {
        name: 'Ethereum',
        contract: '0x0ec78ed49c2d27b315d462d43b5bab94d2c79bf8',
        dexScreener: 'https://dexscreener.com/ethereum/',
        tradingPartner: 'https://app.uniswap.org/',
        color: '#00ff88',
        active: true,
        mockData: {
            marketCap: '$2,450,000',
            volume: '$125,000',
            liquidity: '$850,000',
            price: '$0.0045'
        }
    },
    avalanche: {
        name: 'Avalanche',
        contract: '0x9209e7EbD056d72C5996220e99df6049253DeBCf',
        dexScreener: 'https://dexscreener.com/avalanche/',
        tradingPartner: 'https://avaxarena.com/',
        color: '#ff4444',
        active: true,
        mockData: {
            marketCap: '$1,890,000',
            volume: '$95,000',
            liquidity: '$650,000',
            price: '$0.0042'
        }
    },
    chain3: {
        name: 'Chain 3',
        contract: 'Coming Soon',
        dexScreener: '#',
        tradingPartner: '#',
        color: '#9c27b0',
        active: false
    },
    chain4: {
        name: 'Chain 4',
        contract: 'Coming Soon',
        dexScreener: '#',
        tradingPartner: '#',
        color: '#ff9800',
        active: false
    },
    chain5: {
        name: 'Chain 5',
        contract: 'Coming Soon',
        dexScreener: '#',
        tradingPartner: '#',
        color: '#00bcd4',
        active: false
    },
    chain6: {
        name: 'Chain 6',
        contract: 'Coming Soon',
        dexScreener: '#',
        tradingPartner: '#',
        color: '#8bc34a',
        active: false
    },
    chain7: {
        name: 'Chain 7',
        contract: 'Coming Soon',
        dexScreener: '#',
        tradingPartner: '#',
        color: '#ff5722',
        active: false
    },
    chain8: {
        name: 'Chain 8',
        contract: 'Coming Soon',
        dexScreener: '#',
        tradingPartner: '#',
        color: '#795548',
        active: false
    },
    zchain: {
        name: 'Z Chain',
        contract: 'Coming Soon',
        dexScreener: '#',
        tradingPartner: '#',
        color: '#607d8b',
        active: false
    }
};

// Global state
let selectedChain = null;
let currentWallet = null;
let priceAlerts = [];

// DOM Elements
const chainPanels = document.querySelectorAll('.chain-panel');
const selectedChainElement = document.getElementById('selectedChain');
const chainLinksElement = document.getElementById('chainLinks');
const marketCapElement = document.getElementById('marketCap');
const volumeElement = document.getElementById('volume');
const liquidityElement = document.getElementById('liquidity');
const priceElement = document.getElementById('price');
const contractAddressElement = document.getElementById('contractAddress');
const walletAddressInput = document.getElementById('walletAddress');
const trackWalletButton = document.getElementById('trackWallet');
const walletHoldingsElement = document.getElementById('walletHoldings');
const setAlertButton = document.getElementById('setAlert');
const dexScreenerButton = document.getElementById('dexScreener');
const tradingPartnerButton = document.getElementById('tradingPartner');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeChainPanels();
    initializeButtons();
    initializeWalletTracking();
    
    // Select Ethereum by default
    selectChain('ethereum');
});

// Initialize chain panel click handlers
function initializeChainPanels() {
    chainPanels.forEach(panel => {
        panel.addEventListener('click', function() {
            const chain = this.dataset.chain;
            selectChain(chain);
            
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
        
        // Add hover effects for active chains
        const chain = panel.dataset.chain;
        if (chainConfig[chain].active) {
            panel.addEventListener('mouseenter', function() {
                if (!this.classList.contains('selected')) {
                    this.style.transform = 'translateY(-5px) scale(1.02)';
                }
            });
            
            panel.addEventListener('mouseleave', function() {
                if (!this.classList.contains('selected')) {
                    this.style.transform = '';
                }
            });
        }
    });
}

// Select a chain and update the trading info panel
function selectChain(chainKey) {
    if (!chainConfig[chainKey]) return;
    
    const config = chainConfig[chainKey];
    selectedChain = chainKey;
    
    // Update active states
    chainPanels.forEach(panel => {
        panel.classList.remove('selected');
        if (panel.dataset.chain === chainKey) {
            panel.classList.add('selected');
        }
    });
    
    // Update trading info panel
    updateTradingInfo(config);
    
    // Update action buttons
    updateActionButtons(config);
}

// Update the trading information display
function updateTradingInfo(config) {
    selectedChainElement.textContent = config.name;
    
    // Update contract address
    if (config.active) {
        contractAddressElement.innerHTML = `
            <strong>Contract Address:</strong><br>
            <span style="color: ${config.color};">${config.contract}</span>
            <button onclick="copyToClipboard('${config.contract}')" style="margin-left: 10px; padding: 5px 10px; border: none; border-radius: 5px; background: ${config.color}; color: white; cursor: pointer;">
                <i class="fas fa-copy"></i> Copy
            </button>
        `;
        
        // Update stats with mock data
        if (config.mockData) {
            marketCapElement.textContent = config.mockData.marketCap;
            volumeElement.textContent = config.mockData.volume;
            liquidityElement.textContent = config.mockData.liquidity;
            priceElement.textContent = config.mockData.price;
            
            // Add positive/negative indicators
            priceElement.innerHTML += ' <span style="color: #4caf50; font-size: 0.8em;">▲ 2.5%</span>';
        }
        
        // Update chain links
        chainLinksElement.innerHTML = `
            <a href="${config.dexScreener}${config.contract}" target="_blank" class="chain-link" style="color: ${config.color};">
                <i class="fas fa-chart-line"></i> View Chart
            </a>
            <a href="${config.tradingPartner}" target="_blank" class="chain-link" style="color: ${config.color};">
                <i class="fas fa-exchange-alt"></i> Trade Now
            </a>
        `;
    } else {
        contractAddressElement.textContent = 'Coming Soon - Stay tuned for the launch!';
        marketCapElement.textContent = '-';
        volumeElement.textContent = '-';
        liquidityElement.textContent = '-';
        priceElement.textContent = '-';
        chainLinksElement.innerHTML = '<span style="color: #999;">Links will be available upon launch</span>';
    }
}

// Update action button functionality
function updateActionButtons(config) {
    // Update button states
    setAlertButton.disabled = !config.active;
    dexScreenerButton.disabled = !config.active;
    tradingPartnerButton.disabled = !config.active;
    
    if (!config.active) {
        setAlertButton.style.opacity = '0.5';
        dexScreenerButton.style.opacity = '0.5';
        tradingPartnerButton.style.opacity = '0.5';
    } else {
        setAlertButton.style.opacity = '1';
        dexScreenerButton.style.opacity = '1';
        dexScreenerButton.style.opacity = '1';
    }
}

// Initialize button click handlers
function initializeButtons() {
    setAlertButton.addEventListener('click', function() {
        if (selectedChain && chainConfig[selectedChain].active) {
            showPriceAlertModal();
        }
    });
    
    dexScreenerButton.addEventListener('click', function() {
        if (selectedChain && chainConfig[selectedChain].active) {
            const config = chainConfig[selectedChain];
            window.open(`${config.dexScreener}${config.contract}`, '_blank');
        }
    });
    
    tradingPartnerButton.addEventListener('click', function() {
        if (selectedChain && chainConfig[selectedChain].active) {
            const config = chainConfig[selectedChain];
            window.open(config.tradingPartner, '_blank');
        }
    });
}

// Initialize wallet tracking functionality
function initializeWalletTracking() {
    trackWalletButton.addEventListener('click', function() {
        const walletAddress = walletAddressInput.value.trim();
        if (walletAddress) {
            trackWallet(walletAddress);
        } else {
            showNotification('Please enter a valid wallet address', 'error');
        }
    });
    
    // Allow Enter key to trigger wallet tracking
    walletAddressInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            trackWalletButton.click();
        }
    });
    
    // Validate wallet address format
    walletAddressInput.addEventListener('input', function() {
        const value = this.value.trim();
        if (value.length > 0 && !isValidWalletAddress(value)) {
            this.style.borderColor = '#ff6b6b';
        } else {
            this.style.borderColor = '#ddd';
        }
    });
}

// Track wallet holdings
async function trackWallet(walletAddress) {
    if (!isValidWalletAddress(walletAddress)) {
        showNotification('Invalid wallet address format', 'error');
        return;
    }
    
    currentWallet = walletAddress;
    trackWalletButton.textContent = 'Loading...';
    trackWalletButton.disabled = true;
    
    try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Mock wallet data
        const mockHoldings = generateMockWalletData(walletAddress);
        displayWalletHoldings(mockHoldings);
        
        showNotification('Wallet data loaded successfully!', 'success');
    } catch (error) {
        showNotification('Error loading wallet data', 'error');
        console.error('Error tracking wallet:', error);
    } finally {
        trackWalletButton.textContent = 'Track Wallet';
        trackWalletButton.disabled = false;
    }
}

// Generate mock wallet data
function generateMockWalletData(walletAddress) {
    const holdings = [];
    let totalValue = 0;
    let totalPnL = 0;
    
    // Add holdings for active chains only
    Object.entries(chainConfig).forEach(([key, config]) => {
        if (config.active) {
            const balance = Math.random() * 1000000 + 10000; // Random balance between 10k-1M
            const avgPrice = parseFloat(config.mockData.price.replace('$', ''));
            const currentPrice = avgPrice;
            const value = balance * currentPrice;
            const pnl = (Math.random() - 0.5) * value * 0.5; // Random P&L
            
            holdings.push({
                chain: key,
                name: config.name,
                balance: balance.toLocaleString(undefined, { maximumFractionDigits: 0 }),
                value: value.toLocaleString(undefined, { style: 'currency', currency: 'USD' }),
                avgPrice: avgPrice.toFixed(6),
                currentPrice: currentPrice.toFixed(6),
                pnl: pnl.toLocaleString(undefined, { style: 'currency', currency: 'USD' }),
                pnlPercent: ((pnl / (value - pnl)) * 100).toFixed(2),
                color: config.color
            });
            
            totalValue += value;
            totalPnL += pnl;
        }
    });
    
    return {
        totalValue: totalValue.toLocaleString(undefined, { style: 'currency', currency: 'USD' }),
        totalPnL: totalPnL.toLocaleString(undefined, { style: 'currency', currency: 'USD' }),
        totalPnLPercent: ((totalPnL / (totalValue - totalPnL)) * 100).toFixed(2),
        holdings: holdings
    };
}

// Display wallet holdings
function displayWalletHoldings(data) {
    document.getElementById('totalValue').textContent = data.totalValue;
    
    const pnlElement = document.getElementById('totalPnL');
    pnlElement.textContent = `${data.totalPnL} (${data.totalPnLPercent}%)`;
    pnlElement.style.color = parseFloat(data.totalPnLPercent) >= 0 ? '#4caf50' : '#f44336';
    
    const holdingsBreakdown = document.getElementById('holdingsBreakdown');
    holdingsBreakdown.innerHTML = '';
    
    data.holdings.forEach(holding => {
        const holdingDiv = document.createElement('div');
        holdingDiv.className = 'chain-holding';
        holdingDiv.style.borderLeftColor = holding.color;
        
        holdingDiv.innerHTML = `
            <h4>${holding.name} ($MEOW)</h4>
            <div class="holding-details">
                <span>Balance:</span>
                <span>${holding.balance} MEOW</span>
                <span>Value:</span>
                <span>${holding.value}</span>
                <span>Avg Price:</span>
                <span>$${holding.avgPrice}</span>
                <span>Current Price:</span>
                <span>$${holding.currentPrice}</span>
                <span>P&L:</span>
                <span style="color: ${parseFloat(holding.pnlPercent) >= 0 ? '#4caf50' : '#f44336'}">
                    ${holding.pnl} (${holding.pnlPercent}%)
                </span>
            </div>
        `;
        
        holdingsBreakdown.appendChild(holdingDiv);
    });
    
    walletHoldingsElement.style.display = 'block';
    walletHoldingsElement.scrollIntoView({ behavior: 'smooth' });
}

// Utility functions
function isValidWalletAddress(address) {
    // Basic validation for Ethereum-style addresses
    return /^0x[a-fA-F0-9]{40}$/.test(address);
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Address copied to clipboard!', 'success');
    }).catch(() => {
        showNotification('Failed to copy address', 'error');
    });
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 10px;
        color: white;
        font-weight: 600;
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    switch (type) {
        case 'success':
            notification.style.background = '#4caf50';
            break;
        case 'error':
            notification.style.background = '#f44336';
            break;
        default:
            notification.style.background = '#2196f3';
    }
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function showPriceAlertModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 20px;
        max-width: 400px;
        width: 90%;
        text-align: center;
    `;
    
    modalContent.innerHTML = `
        <h3 style="margin-bottom: 20px; color: #333;">Set Price Alert</h3>
        <p style="margin-bottom: 20px; color: #666;">Get notified when $MEOW reaches your target price on ${chainConfig[selectedChain].name}</p>
        <input type="number" id="alertPrice" placeholder="Enter target price (USD)" style="width: 100%; padding: 15px; border: 2px solid #ddd; border-radius: 10px; margin-bottom: 20px; font-size: 1rem;">
        <div style="display: flex; gap: 10px; justify-content: center;">
            <button onclick="setAlert()" style="padding: 10px 20px; background: #4caf50; color: white; border: none; border-radius: 10px; cursor: pointer;">Set Alert</button>
            <button onclick="closeModal()" style="padding: 10px 20px; background: #f44336; color: white; border: none; border-radius: 10px; cursor: pointer;">Cancel</button>
        </div>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Close modal on overlay click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Global functions for modal
    window.setAlert = function() {
        const price = document.getElementById('alertPrice').value;
        if (price && price > 0) {
            priceAlerts.push({
                chain: selectedChain,
                price: parseFloat(price),
                timestamp: new Date()
            });
            showNotification(`Price alert set for $${price} on ${chainConfig[selectedChain].name}`, 'success');
            closeModal();
        } else {
            showNotification('Please enter a valid price', 'error');
        }
    };
    
    window.closeModal = function() {
        document.body.removeChild(modal);
        delete window.setAlert;
        delete window.closeModal;
    };
}

// Add CSS for chain links
const style = document.createElement('style');
style.textContent = `
    .chain-link {
        text-decoration: none;
        padding: 8px 15px;
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.2);
        transition: all 0.3s ease;
        display: inline-flex;
        align-items: center;
        gap: 5px;
    }
    
    .chain-link:hover {
        background: rgba(255, 255, 255, 0.3);
        transform: translateY(-2px);
    }
    
    .notification {
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    }
`;
document.head.appendChild(style);

// Add some fun easter eggs
let clickCount = 0;
document.addEventListener('click', function(e) {
    if (e.target.closest('.meow-face')) {
        clickCount++;
        if (clickCount % 10 === 0) {
            showNotification('🐱 Meow! You found a secret! 🐱', 'success');
        }
    }
});

// Simulate live price updates
setInterval(() => {
    if (selectedChain && chainConfig[selectedChain].active) {
        const config = chainConfig[selectedChain];
        const currentPrice = parseFloat(config.mockData.price.replace('$', ''));
        const change = (Math.random() - 0.5) * 0.0001;
        const newPrice = Math.max(0.0001, currentPrice + change);
        const changePercent = ((newPrice - currentPrice) / currentPrice * 100);
        
        config.mockData.price = `$${newPrice.toFixed(6)}`;
        
        if (document.getElementById('selectedChain').textContent === config.name) {
            priceElement.innerHTML = `${config.mockData.price} <span style="color: ${changePercent >= 0 ? '#4caf50' : '#f44336'}; font-size: 0.8em;">${changePercent >= 0 ? '▲' : '▼'} ${Math.abs(changePercent).toFixed(2)}%</span>`;
        }
    }
}, 5000); // Update every 5 seconds