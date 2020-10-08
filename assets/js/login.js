$(function () {
    // 1.点击事件
    $('#regBox').on('click', function () {
        $('.reg_box').show();
        $('.login_box').hide();        
    });
    $('#loginBox').on('click', function () {
        $('.login_box').show();
        $('.reg_box').hide();
    });

    // 2.登录表单验证
    var form = layui.form;
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        repwd: function (value) {
            var pwd = $(".reg_box [name=password]").val();
            if (pwd !== value) {
                return '两次密码不一致'
            }
        }
    });

    // 3.注册表单提交
    var layer = layui.layer;
    $('#regForm').on('submit', function (e) {
        // 阻止表单默认提交行为
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/api/reguser',
            data: {
                username: $('#regForm [name=username]').val(),
                password: $('#regForm [name=password]').val()
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('注册成功，请登录');
                $('#loginBox').click();
            }
        })
    })
    
    // 4.登录表单提交
    $('#loginForm').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/api/login',
            // 快速获取表单中的数据
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败');
                }
                layer.msg('登录成功');
                localStorage.setItem('token', res.token);
                location.href = '/index.html';
            }
        })
    })



})