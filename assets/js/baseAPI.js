$.ajaxPrefilter(function (options) {
    options.url = 'http://ajax.frontend.itheima.net' + options.url;

    // 统一为有权限的接口设置headers请求头
    if (options.url.indexOf("/my/") !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || '',
        }
    }
    // 优化权限控制代码
    options.complete =  function (res) {
        if (res.responseJSON.status == 1 && res.responseJSON.message === '身份认证失败！') {
            localStorage.removeItem('token');
            location.href = 'login.html';
        }
    }
})