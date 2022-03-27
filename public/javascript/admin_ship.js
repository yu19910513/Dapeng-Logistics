function pre_ship_scan(s3) {
    localStorage.setItem('pre-ship_item', s3);
    window.location.href = '/admin_pre_ship';
};
