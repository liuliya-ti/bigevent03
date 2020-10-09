$(function () {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    // 2.点击弹出文件选择框
    $('#btnChooseImage').on('click', function () {
        $('#file').click();
    })
    // 3.更换裁剪区域的图片
    var layer = layui.layer;
    $('#file').on('change', function (e) {
        // 3.1拿到用户选择的文件
        var file = e.target.files[0];
        if (file === 0) {
            return layer.msg('请选择照片');
        }        
        // 3.2将文件，转换为路径
        var imgURL = URL.createObjectURL(file);
        // 3.3重新初始化裁剪区域
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', imgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 4.上传头像
    $('#btnUpload').on('click', function () {
        // 获取base64类型的头像（字符串）
        var dataURL = $image
        .cropper('getCroppedCanvas', {
          // 创建一个 Canvas 画布
          width: 100,
          height: 100
        })
            .toDataURL('image/png')
        // 发送ajax
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar:dataURL
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('更改头像成功');
                window.parent.getUserInfo();
            }
        })
    })
    // 5.设置头像默认值
    getUserInfo()
    function getUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status != 0) {
                    return layui.layer.msg(res.message);
                }
                $image
                    .cropper('destroy')      // 销毁旧的裁剪区域
                    .attr('src', res.data.user_pic)  // 重新设置图片路径
                    .cropper(options) 
            }
        })
    } 
})