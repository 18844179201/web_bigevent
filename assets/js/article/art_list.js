$(function () {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage;
    //梅花时间

    template.defaults.imports.dataFormat = function (data) {
        const dt = new Date(data)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDay())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())
        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
    }

    //补0
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    var q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
    }
    initTable()
    initCate()
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                var htmlStr = template('tpl_table', res)
                $('tbody').html(htmlStr)
                rendPage(res.total)
            }
        })
    }

    //舒适化文章分类
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类失败')
                }
                var htmlStr = template('tpl_cate', res)
                $('[name=cate_id]').html(htmlStr)
                //layui渲染
                form.render()
            }
        })
    }

    //筛选绑定时间
    $('#form_search').on('submit', function (e) {
        e.preventDefault()
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        q.cate_id = cate_id
        q.state = state

        initTable()
    })

    //分页
    function rendPage(total) {
        laypage.render({
            elem: 'pageBox',
            count: total,
            limit: q.pagesize,
            curr: q.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            jump: function (obj, first) {
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                //首次不执行
                if (!first) {
                    //do something
                    initTable()
                }
            }
        })
    }

    //删除
    $('tbody').on('click', '.btn_delete', function () {
        var len = $('.btn_delete').length
        var id = $(this).attr('data-id')
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res){
                    if(res.status !== 0){
                        return layer.msg('删除文章失败')
                    }
                    layer.msg('删除文章成功')
                    //判断当前页是否还有数据，没有的话，页码-1
                    if(len === 1){
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum -1
                    }
                    initTable()
                }
            })
            layer.close(index);
        });
    })
})