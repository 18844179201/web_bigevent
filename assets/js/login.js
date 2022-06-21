$(function () {
  // 点击注册账号
  $('#link_reg').on('click', function () {
    $('.login_box').hide()
    $('.reg_box').show();
  })

  // 点击去登陆
  $('#link_login').on('click', function () {
    $('.reg_box').hide()
    $('.login_box').show();
  })

  //自定义校验规则
  var form = layui.form
  var layer = layui.layer
  form.verify({
    pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],

    repwd: function (value) {
      var pwd = $('.reg_box [name=password]').val()
      if (pwd !== value) {
        return '两次密码不一致'
      }
    }
  })


  //注册表单事件
  $('#form_reg').on('submit', function (e) {
    e.preventDefault()

    var data = { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() }

    $.post('/api/reguser', data, function (res) {
      
      if (res.status !== 0) {
        return layer.msg(res.message);
      }
      layer.msg(res.message);

      //模拟点击行为
      $('#link_login').click()
    })
  })

  //登录
  $('#form_login').submit(function(e){
    e.preventDefault()

    $.ajax({
      url: '/api/login',
      method: 'POST',
      // 快速获取表单数据
      data: $(this).serialize(),
      success: function(res){
        if(res.status !== 0){
          return layer.msg(res.message)
        }
        layer.msg(res.message),
        // token存储
        localStorage.setItem('token', res.token)
        location.href = '/index.html'
      }
    })
  })

})