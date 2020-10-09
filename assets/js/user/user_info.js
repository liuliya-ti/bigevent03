$(function () {
    // 1.表单验证
    var form = layui.form;
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度必须在1~6个字符之间'
            }
        }
    })
    // 2.获取用户的基本信息
    initUserInfo();
    var layer = layui.layer;
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取失败');
                }
                // console.log(res);
                // 3.为表单快速赋值
                form.val('formUserInfo', res.data);
            }

        })
    }
    // 4.表单重置
    $('#btnReset').on('click', function (e) {
        e.preventDefault();
        initUserInfo();
    })
    // 5.发起请求更新用户的信息
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data:$(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('更新用户信息成功！');
                window.parent.getUserInfo();
            }
            
        })
    })

})

