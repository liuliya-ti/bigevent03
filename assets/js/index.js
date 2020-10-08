$(function () {
    // 1.获取用户基本信息
    getUserInfo();

    var layer = layui.layer;
    // 3.实现退出功能
    $('.layui-nav-item').on('click', function () {
        layer.confirm('确定要退出吗?', { icon: 3, title: '提示' }, function (index) {
            //do something
            // 清空本地存储中的token
            localStorage.removeItem('token');
            location.href = 'login.html';
            layer.close(index);

        });
    })

})

// 1.获取用户基本信息
function getUserInfo() {
    $.ajax({
        mthod: 'GET',
        url: '/my/userinfo',
        // headers就是请求头配置对象
        // headers: {
        //     Authorization: localStorage.getItem('token') || '',
        // },
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户失败');
            }
            console.log(res);
            renrderAvatar(res.data);
        },
        // 4.控制用户访问权限
        // complete: function (res) {
        //     if (res.responseJSON.status == 1 && res.responseJSON.message === '身份认证失败！') {
        //         localStorage.removeItem('token');
        //         location.href = 'login.html';
        //     }
        // }
    })
}

// 2.渲染用户头像和名称
function renrderAvatar(user) {
    // 1.获取用户的名称
    name = user.nickname || user.username;
    // 2.设置欢迎文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    // 3.按需渲染用户头像
    if (user.user_pic !== null) {
        // 3.1渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.textImg').hide();
    } else {
        // 3.2渲染文本头像
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase();
        $('.textImg').html(first).show();
    }
}