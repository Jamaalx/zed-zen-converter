class Analytics {
  constructor() {
    this.sessionStart = Date.now();
    this.conversionsThisSession = 0;
    this.totalConversions = this.loadTotalConversions();
    this.hasShownTimePopup = false;
    this.hasShownConversionPopup = false;
    this.hasShown10ConversionPopup = false;
    this.isPremium = this.checkPremiumStatus();
  }

  loadTotalConversions() {
    const stored = localStorage.getItem('zedzen_total_conversions');
    return stored ? parseInt(stored) : 0;
  }

  saveTotalConversions() {
    localStorage.setItem('zedzen_total_conversions', this.totalConversions.toString());
  }

  checkPremiumStatus() {
    // Check if user has premium - for now always false
    const premium = localStorage.getItem('zedzen_premium');
    return premium === 'true';
  }

  incrementConversion() {
    this.conversionsThisSession++;
    this.totalConversions++;
    this.saveTotalConversions();
  }

  getSessionDuration() {
    return Math.floor((Date.now() - this.sessionStart) / 1000); // in seconds
  }

  shouldShowTimePopup() {
    const duration = this.getSessionDuration();
    return duration >= 300 && !this.hasShownTimePopup; // 5 minutes
  }

  shouldShowConversionPopup() {
    return this.conversionsThisSession >= 5 && !this.hasShownConversionPopup;
  }

  shouldShow10ConversionPopup() {
    return this.totalConversions >= 10 && !this.hasShown10ConversionPopup;
  }

  markTimePopupShown() {
    this.hasShownTimePopup = true;
  }

  markConversionPopupShown() {
    this.hasShownConversionPopup = true;
  }

  mark10ConversionPopupShown() {
    this.hasShown10ConversionPopup = true;
  }

  getTotalConversions() {
    return this.totalConversions;
  }
}

export default new Analytics();