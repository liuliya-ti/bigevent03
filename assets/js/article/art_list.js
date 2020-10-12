$(function () {
    // 为 art-template 定义时间过滤器
    template.defaults.imports.dateFormat = function (dtStr) {
        var dt = new Date(dtStr);

        var y = dt.getFullYear();
        var m = PadZero(dt.getMonth() + 1);
        var d = PadZero(dt.getDate());

        var hh = PadZero(dt.getHours());
        var mm = PadZero(dt.getMinutes());
        var ss = PadZero(dt.getSeconds());

        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
    }
    // 在个位数左侧填充0
    function PadZero(n) {
        return n > 9 ? n : '0' + n;
    }


    // 1.定义提交参数
    // 定义一个查询的参数对象，将来请求数据的时候
    // 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1,   // 页码值，默认请求第一页的数据
        pagesize: 2,  // 每页显示几条数据，默认每页显示2条
        cate_id: '',  // 文章分类的Id
        state: ''      // 文章的发布状态
    }

    // 2.初始化文章列表
    initTable();
    function initTable() {
        $.ajax({
            method: 'get',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                console.log(res);
                var str = template("tpl-table", res);
                $("tbody").html(str);
                // 分页
                renderPage(res.total);
            }
        })
    }

    // 3.初始化分类
    var form = layui.form;
    var layer = layui.layer;
    initCate();
    // 封装
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 赋值，渲染form
                var htmlStr = template("tpl-cate", res);
                // console.log(htmlStr);
                $('[name=cate_id]').html(htmlStr);
                // 通过 layui 重新渲染表单区域的UI结构
                form.render();
            }
        })
    }
    // 4.筛选功能
    $("#form-search").on("submit", function (e) {
        e.preventDefault();
        // 获取
        var state = $('[name=state]').val();
        var cate_id = $("[name=cate_id]").val();
        // 赋值
        q.state = state;
        q.cate_id = cate_id;
        // 初始化文章列表
        initTable();
    })
    // 5.分页
    var laypage = layui.laypage;
    function renderPage(total) {
        // alert(total);
        //执行一个laypage实例
        laypage.render({
            elem: 'pageBox' ,//注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize,//每页几条 
            curr: q.pagenum, //当前页码  
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits:[2,3,5,10],
            // 触发jump：分页初始化的时候，页码改变的时候
            jump: function (obj, first) {
                // obj:所有参数所在的对象；first:是否是在第一次初始化分页
                // 改变当前页
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                // 判断，不是第一次初始化分页，才能重新调用初始化文章列表
                if (!first) {
                    // 初始化文章列表
                    initTable();
                }
            }
        });
    }
    // 6.删除
    $('tbody').on('click', '.btn-delete', function () {
        var Id = $(this).attr('data-id');
        // 提示用户是否要删除
        layer.confirm('删除？', {icon: 3, title:'提示'}, function(index){
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + Id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！')
                    }
                    
                    layer.msg('删除分类成功');    
                    // 页面汇总删除按钮个数等于1，页码大于1；
                    if ($(".btn-delete").length == 1 && q.pagenum > 1) q.pagenum--;
                    initTable();
                }
            })
            layer.close(index);
            
          });
    })
   
})