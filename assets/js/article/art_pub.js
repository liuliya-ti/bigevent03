$(function () {
    var form = layui.form;
    var layer = layui.layer;


    initCate();
    // 初始化富文本编辑器
    initEditor();
    // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("初始化文章分类失败！");
                }
                // 调用模板引擎，渲染分类的下拉菜单
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                form.render();
            }
        })
    }
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 4.点击按钮，选择图片
    $('#btnChoseImage').on('click', function () {
        $('#coverFile').click();
    })
    // 5.设置图片
    $('#coverFile').on('change', function (e) {
        // 拿到用户选择的文件
        var file = e.target.files[0];
        // 非空校验！
        if (file == undefined) {
            return;
        }
        // 根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(file);
        // 先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })
    // 6.设置状态
    var state = '已发布';
    $('#btnSave2').on('click', function () {
        state = '草稿';
    })
    // 7.添加文章
    $('#form-pub').on('submit', function (e) {
        // 阻止默认提交
        e.preventDefault();
        // 创建FormData对象，收集数据
        var fd = new FormData(this);
        // 放入状态
        fd.append('state', state);
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob);
                // console.log(...fd);
                publishArticle(fd);
            })

    })
    // 封装，添加文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 跳转页面
                // location.href = '/article/art_list.html';
                // 去除bug
                layer.msg('添加成功，跳转中...');
                setTimeout(function () {
                    window.parent.document.querySelector('#art_list').click();
                },1500)
            }
        })
    }

})