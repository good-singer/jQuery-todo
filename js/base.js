;(function(){
  'use strict';
  
  var $form_add_task = $('.add-task-submit'), 
  $delete_task,
  task_list = [];

  init();

  $form_add_task.on('click', on_add_task_form_submit)

  function on_add_task_form_submit(e){
    var new_task = {};
    e.preventDefault(); //禁用默认行为
    var $input_val = $('input[name=content]');
    new_task.content = $input_val.val(); //获取新的Task值
    if(!new_task.content) {
      return; //如果新Task的值为空，则直接返回，否则继续执行
    }
    
    // 存入新Task
    if(add_task(new_task)) {
      // render_task_list();
      $input_val.val(null); 
    }
  }
  
  //查找并监听所有删除按钮点击事件
  function listen_task_delete(){
    $delete_task.on('click', function() {
      var $this = $(this);
      //找到删除按钮所在的task元素
      var $item = $this.parent().parent();
      var index = $item.data('index');
      var temp = confirm('确定删除？');
      temp ? delete_task(index): null;
    })
  }

  function add_task(new_task){
    // 将新task插入到task_list中
    task_list.push(new_task);

    // 更新localStorage
    refresh_task_list();
    return true;
  }
  //刷新localStorage数据并渲染模板
  function refresh_task_list(){
    store.set('task_list',task_list);
    render_task_list();
  }

  //删除一条task
  function delete_task(index) {
    //如果没有index 或者 index不存在则直接返回
    if(index === undefined || !task_list[index]) return;

    delete task_list[index];
    // 更新localStorage
    refresh_task_list();
  }

  function init() {
    task_list = store.get('task_list') || [];
    if(task_list.length)
      render_task_list();
  }
  
  //渲染所有的task
  function render_task_list() {
    var $task_list = $('.task-list');
    $task_list.html('');
    for(var i = 0; i<task_list.length; i++) {
      var $task = render_task_item(task_list[i], i);
      $task_list.append($task);
    }
    $delete_task = $('.action.delete');
    listen_task_delete();
  }

  //渲染单挑task
  function render_task_item(data, index) {
    if(!data || index === undefined) return;
    var list_item_tpl = 
      '<div class="task-item" data-index="' + index +'">' + 
        '<span><input type="checkbox" name="" id=""></span>' +
        '<span class="task-content">'+ data.content +'</span>' +
        '<span class="fr">' +
          '<span class="action delete"> 删除</span>'+
          '<span class="action">&nbsp;&nbsp;详细</span>'+
        '</span>'+
      '</div>';

    return $(list_item_tpl);
  }
})();