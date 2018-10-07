$(function() {

    var allnoteList = $("#allNoteList");
    var noteTemp = window.localStorage.note ? JSON.parse(window.localStorage.note) : [];


    // 保存数据方法
    function saveNoteData() {
        window.localStorage.note = JSON.stringify(noteTemp);
    }
    // 1.加载（渲染）日记的函数(每次修改后)
    function loadNote() {
        if(window.localStorage.note){
            var note = JSON.parse(localStorage.note);
            allnoteList.empty();
            var html = '';
            if(note.length > 0) {
                for(var i =0; i < note.length; i++){
                    // 只有delete标识为false的时候才显示出来
                    if(!note[i]['delete']){
                        html += '<li id=note' + i + ' data-id="'+ note[i]['id']+'"><a href="javascript:;" class="note"><h3 class="note-h">' + note[i]['title'] + '</h3><p class="note-c">' +
                            note[i]['content'] + '</p></a><a href="javascript:;" class="note-delete" data-icon="delete" >删除</a></li>';
                    }
                }
            }
            allnoteList.append(html);
            $("#allNote").page();
        	allnoteList.listview('refresh');
            
        }
    }

    loadNote();
    
    //note详情
    $("#noteDetail").on("pageshow", function() {
    	var notebook = JSON.parse(localStorage.notebook);
            $("#select-detail").empty();
            var html = '';
            if(notebook.length > 0) {
                for(var i =0; i < notebook.length; i++){
                    // 只有delete标识为false的时候才显示出来
                    if(!notebook[i]['delete']){
                        html += '<option>'+ notebook[i].bookName +'</option>'
                    }
                }
            }
            $("#select-detail").append(html);
            
    });


    // 2.增加note
    $("#addNotePage").on("tap", function() {
        $.mobile.changePage("#addNote", {});
    });
    $("#addNote").on("pageshow", function() {
    	if(window.localStorage.notebook){
            var notebook = JSON.parse(localStorage.notebook);
            $("#selector").empty();
            var html = '';
            if(notebook.length > 0) {
                for(var i =0; i < notebook.length; i++){
                    // 只有delete标识为false的时候才显示出来
                    if(!notebook[i]['delete']){
                        html += '<option>'+ notebook[i].bookName +'</option>'
                    }
                }
            }
            $("#selector").append(html);
            
        }
        $("#title").val("").focus();
        $("#info").val("");
    });
    $("#addNoteButton").on("tap",saveNote);
    function saveNote() {
        var title = $("#title").val(),
        	type=$("#selector").val(),
            content = $("#info").val();
        if($.trim(title) == '') {
            $("#title").focus();
            return false;
        }
        if($.trim(content) == '') {
            $("#info").focus();
            return false;
        }
        var time = +new Date();

        noteTemp.unshift({
            id: noteTemp.length,
            title: title,
            type:type,
            content: content,
            delete: false,
            time: time
        });
        $(".ui-dialog").dialog("close");
        saveNoteData();
        loadNote();
    }

    // 4.查看并能修改
    var editId ;
    $("#allNoteList").on("tap", ".note", function() {
        var title = $(this).find(".note-h").text(),
            content = $(this).find(".note-c").text();
        editId = $(this).parent("li").attr("id").slice(4);
        var time = new Date(noteTemp[editId].time);
        $.mobile.changePage("#noteDetail", {});
        $('#noteDetail').on('pageshow', function() {
            $(".edit-head").text(title);
            $('.edit-title').val(title);
            $('.edit-info').val(content);
            $(".edit-time").text(time);
        })
    });

    $(".edit-save").on("tap", function() {
        var title = $(".edit-title").val(),
            content = $(".edit-info").val();
        if($.trim(title) == '') {
            $(".edit-title").focus();
            return false;
        }
        if($.trim(content) == '') {
            $(".edit-info").focus();
            return false;
        }
        var time = +new Date();
        var changeTemp = noteTemp.splice(editId,1)[0]; // 这里返回的是一个数组
        changeTemp.title = title;
        changeTemp.content = content;
        changeTemp.time = time;
        noteTemp.unshift(changeTemp);
        history.go(-1);
        saveNoteData();
        loadNote();
        return false;
    })

    // 3.删除note
    $("#allNoteList").on("tap", ".note-delete", function() {
        var id = $(this).parent('li').attr('id').slice(4);
        deleteNote(id);
        return false; 
    });

    // 伪删除数组里面的数据 刷新页面
    function deleteNote(id) {
        noteTemp[id].delete = true;
        saveNoteData();
        loadNote();
    }
    
    //笔记本
    var notebookList = $("#notebookList");
    var notebookTemp = window.localStorage.notebook ? JSON.parse(window.localStorage.notebook) : [];


    // 保存数据方法
    function saveNotebookData() {
        window.localStorage.notebook = JSON.stringify(notebookTemp);
    }
    // 1.加载（渲染）日记的函数(每次修改后)
    function loadNotebook() {
        if(window.localStorage.notebook){
            var notebook = JSON.parse(localStorage.notebook);
            notebookList.empty();
            var html = '';
            if(notebook.length > 0) {
            	//html += '<li><a href="#oneNotebook"><span>笔记本</span><p>'+noteCount("笔记本")+'条笔记</p></a></li>';
                for(var i =0; i < notebook.length; i++){               
                    // 只有delete标识为false的时候才显示出来
                    if(!notebook[i]['delete']){
                        html += '<li id=notebook' + i + ' data-id="'+ notebook[i]['id']+'"bookname="'+notebook[i]['bookName']+'"><a href="#oneNotebook"><span>'+ notebook[i]['bookName'] +'</span><p>'+noteCount(notebook[i]['bookName'])+'条笔记</p></a><a href="javascript:;" class="notebook-delete" data-icon="delete" >删除</a></li>';
                    }
                }
            }
            notebookList.append(html);
            $("#notebook").page();
        	notebookList.listview('refresh');
            
        }
    }
    function noteCount(name){
    	if(notebook.length > 0){
	    	var note = JSON.parse(localStorage.note);
	    	var count=0;
	    	for(var i =0; i < note.length; i++){               
	                    // 只有delete标识为false的时候才显示出来
	                    if(!notebook[i]['delete']){
	                        count+=1;
	                    }
	                }
	    	return count;
	    }
    	return 0;
    }

    loadNotebook();


    // 2.增加notebook
    $("#addNotebookPage").on("tap", function() {
        $.mobile.changePage("#addNotebook", {});
    });
    $("#addNotebook").on("pageshow", function() {
        $("#bookName").val("").focus();
    });
    $("#addNotebookButton").on("tap",saveNotebook);
    function saveNotebook() {
        var bookName = $("#bookName").val();
        if($.trim(bookName) == '') {
            $("#bookName").focus();
            return false;
        }
        var time = +new Date();

        notebookTemp.unshift({
            id: notebookTemp.length,
            bookName: bookName,
            delete: false,
            time: time
        });
        $(".ui-dialog").dialog("close");
        saveNotebookData();
        loadNotebook();
    }

    // 3.删除notebook
    $("#notebookList").on("tap", ".notebook-delete", function() {
        var id = $(this).parent('li').attr('id').slice(8);
        deleteNotebook(id);
        return false; 
    });

    // 伪删除数组里面的数据 刷新页面
    function deleteNotebook(id) {
        notebookTemp[id].delete = true;
        saveNotebookData();
        loadNotebook();
    }


	//提醒
	var remindList = $("#remindList");
    var remindTemp = window.localStorage.remind ? JSON.parse(window.localStorage.remind) : [];


    // 保存数据方法
    function saveRemindData() {
        window.localStorage.remind = JSON.stringify(remindTemp);
    }
    // 1.加载（渲染）日记的函数(每次修改后)
    function loadRemind() {
        if(window.localStorage.remind){
            var remind = JSON.parse(localStorage.remind);
            remindList.empty();
            var html = '';
            if(remind.length > 0) {
                for(var i =0; i < remind.length; i++){
                    // 只有delete标识为false的时候才显示出来
                    if(!remind[i]['delete']){
                        html += '<li id=remind' + i + ' data-id="'+ remind[i]['id']+'"><a href="javascript:;" class="remind"><h3 class="remind-h">' + remind[i]['title'] + '</h3><p class="remind-c">' +
                            remind[i]['time'] + '</p></a><a href="javascript:;" class="remind-delete" data-icon="delete" >删除</a></li>';
                    }
                }
            }
            remindList.append(html);
            $("#remind").page();
        	remindList.listview('refresh');
            
        }
    }

    loadRemind();


    // 2.增加提醒
    $("#addRemindPage").on("tap", function() {
        $.mobile.changePage("#addRemind", {});
    });
    $("#addRemind").on("pageshow", function() {
        $("#title").val("").focus();
        $("#info").val("");
    });
    $("#addRemindButton").on("tap",saveRemind);
    function saveRemind() {
        var title = $("#remindTitle").val(),
        	time=$("#time").val(),
            content = $("#remindInfo").val();
        if($.trim(title) == '') {
            $("#title").focus();
            return false;
        }
        if($.trim(time) == '') {
            $("#time").focus();
            return false;
        }
        if($.trim(content) == '') {
            $("#info").focus();
            return false;
        }
        remindTemp.unshift({
            id: remindTemp.length,
            title: title,
            content: content,
            delete: false,
            time: time
        });
        $(".ui-dialog").dialog("close");
        saveRemindData();
        loadRemind();
        history.go(-1);
    }
    
    

    // 4.查看并能修改
    var editId ;
    $("#remindList").on("tap", ".remind", function() {
        var title = $(this).find(".remind-h").text(),
            time = $(this).find(".remind-c").text();
        editId = $(this).parent("li").attr("id").slice(6);
        var content = remindTemp[editId].content;
        $.mobile.changePage("#remindDetail", {});
        $('#remindDetail').on('pageshow', function() {
            $(".edit-head").text(title);
            $('.remindedit-title').val(title);
            $('.remindedit-info').val(content);
            $(".retime").val(time);
        })
    });

    $("#remind-edit").on("tap", function() {
        var title = $(".remindedit-title").val(),
            time = $(".remindedit-time").val(),
            content = $(".remindedit-info").val();
        if($.trim(title) == '') {
            $(".edit-title").focus();
            return false;
        }
        if($.trim(content) == '') {
            $(".edit-info").focus();
            return false;
        }
        if($.trim(time) == '') {
            $("#time").focus();
            return false;
        }
        var changeTemp = remindTemp.splice(editId,1)[0]; // 这里返回的是一个数组
        changeTemp.title = title;
        changeTemp.content = content;
        changeTemp.time = time;
        remindTemp.unshift(changeTemp);
        history.go(-1);
        saveRemindData();
        loadRemind();
        return false;
    });
    
    

    // 3.删除remind
    $("#remindList").on("tap", ".remind-delete", function() {
        var id = $(this).parent('li').attr('id').slice(6);
        deleteRemind(id);
        return false; 
    });
    $("#todayList").on("tap", ".remind-delete", function() {
        var id = $(this).parent('li').attr('id').slice(6);
        deleteRemind(id);
        return false; 
    });

    // 伪删除数组里面的数据 刷新页面
    function deleteRemind(id) {
        remindTemp[id].delete = true;
        saveRemindData();
        loadRemind();
    }
    
    //显示当天提醒
    $("#home").on("pageshow", function() {
        var remind = JSON.parse(localStorage.remind);
            $("#todayList").empty();
            var html = '';
            if(remind.length > 0) {
                for(var i =0; i < remind.length; i++){
                    // 只有delete标识为false的时候才显示出来
                    if(!remind[i]['delete'] && 
                        (new Date(remind[i]['time']).toDateString()==new Date().toDateString())){
                        html += '<li id=remind' + i + ' data-id="'+ remind[i]['id']+'"><a href="javascript:;" class="remind"><h3 class="remind-h">' + remind[i]['title'] + '</h3><p class="remind-c">' +
                            remind[i]['time'] + '</p></a><a href="javascript:;" class="remind-delete" data-icon="delete" >删除</a></li>';
                    }
                }
            }
            $("#todayList").append(html);
            $("#home").page();
        	$("#todayList").listview('refresh');
    });
    
    $("#todayList").on("tap", ".remind", function() {
        var title = $(this).find(".remind-h").text(),
            time = $(this).find(".remind-c").text();
        editId = $(this).parent("li").attr("id").slice(6);
        var content = remindTemp[editId].content;
        $.mobile.changePage("#remindDetail", {});
        $('#remindDetail').on('pageshow', function() {
            $(".edit-head").text(title);
            $('.remindedit-title').val(title);
            $('.remindedit-info').val(content);
            $(".retime").val(time);
        })
    });
    
    
    /*$("#notebookList").on("tap", function() {
        var bookName = $(this).parent("li span").val();
        //alert(bookName);
        $.mobile.changePage("#oneNotebook", {});
        $('#oneNotebook').on('pageshow', function() {
            var note = JSON.parse(localStorage.note);
            //notebookDetailList.empty();
            var html = '';
            if(note.length > 0) {
                for(var i =0; i < note.length; i++){
                    // 只有delete标识为false的时候才显示出来
                    if(!note[i]['delete'] && (note[i]['type']=="html5")){
                        html += '<li id=note' + i + ' data-id="'+ note[i]['id']+'"><a href="javascript:;" class="note"><h3 class="note-h">' + note[i]['title'] + '</h3><p class="note-c">' +
                            note[i]['content'] + '</p></a><a href="javascript:;" class="note-delete" data-icon="delete" >删除</a></li>';
                    }
                }
            }
            allnoteList.append(html);
            $("#allNote").page();
        	allnoteList.listview('refresh');
        });
    });*/
    
	
});
