$(function(){
    getUserinfo()

    $('#btnLogout').on('click',function(){
        //确认退出
        var layer = layui.layer
        layer.confirm('确定退出登录?', {icon: 3, title:'提示'}, function(index){
            //清空token
            localStorage.removeItem('token')
            //跳转登录
            location.href = '/login.html'
            layer.close(index);
          });
    })
})

//获取用户基本信息
function getUserinfo(){
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success: function (res) {
            if(res.status !== 0){
                return layui.layer.msg('获取失败')
            }
            renderAvatar(res.data)
        },
        
    });
}


//渲染头像
function renderAvatar(user){
    //获取昵称
    var name = user.nickname || user.username

    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    if(user.user_pic !== null){
    //渲染图片
        $('.layui-nav-img').attr('src',user.user_pic).show()
        $('.text-avatar').hide()
    }else{
    //渲染文本
    $('.layui-nav-img').hide()
    var first = name[0].toUpperCase()
    $('.text-avatar').html(first).show()
    }
}