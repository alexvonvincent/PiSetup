function get_base_WPA() {
  const urlparam = new URLSearchParams(window.location.search);
  const template = { SSID: '', domain: '', username: '', password: '', backupSSID: '', backupPassword: '' , primaryEnabled: true, backupEnabled: true};
  template.SSID = urlparam.get('ssid');
  template.domain = urlparam.get('domain');
  template.username = urlparam.get('username');
  template.password = urlparam.get('password');
  template.backupSSID = urlparam.get('backupssid');
  template.backupPassword = urlparam.get('backupPassword');
  return template;
}

const base_wpa = get_base_WPA();

export {base_wpa}
