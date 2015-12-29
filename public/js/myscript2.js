(function(){
  //$('ul.nav-left-ml').toggle();
  $('.columns').droppable({
    drop: function(event, ui) {
      $this = $(this).children('ul');
      $this.find(".placeholder").remove();
      //$("<li></li>").text(ui.draggable.text()).appendTo($this);
      var parentLI = $(ui.draggable).closest('li');
      var str = $(ui.draggable).closest('li').data('unique_name');
      console.log(str);
      var li = $("<li>" + ui.draggable.text() + "<button type='button' class='close'>&times;</button></li>");
      li.data('sub_query', str);
      if(parentLI.children('label').length == 0) {
        li.data('is_member', "yes");
      }
      li.appendTo($this);
      var ht = parseInt($this.parent().outerHeight());
      ht = (ht-39)/2;
      $this.parent().parent().children('.col-xs-2').animate({
         'padding-top' : ht+'px',
         'padding-bottom' : ht+'px'
      });

    }
  });

  $('.columns').on('click', 'button' , function () {
    var pt = $(this).parent().parent().parent();
    $(this).parent().remove();
    var len = pt.find('ul li').length;
    console.log(len);
    if(len === 0) {
      $("<li class='placeholder'>Drag measures/dimensions here</li>").appendTo(pt.children('ul'));
    }
    var ht = parseInt(pt.outerHeight());
    console.log(ht);
    ht = (ht-39)/2;
    pt.parent().children('.col-xs-2').animate({
       'padding-top' : ht+'px',
       'padding-bottom' : ht+'px'
    });
  });

  function generateLI(item) {
    return $("<li><label class='nav-toggle nav-header'><span class='nav-toggle-icon glyphicon glyphicon-chevron-right'></span><a href='#'>" + item + "</a></label></li>");
  }

  function generateUL() {
    return $("<ul class='nav nav-list nav-left-ml'></ul>");
  }

  $('#myModal #dataSource').on('change', function() {
    var parameters = {
      username  : "hotChocolate",
      pathName: "/"+$(this).val()
    };
    $.get('/discover/getServerDetails', parameters, function(data) {
      $('#myModal #catalog').children().remove();
      $('#myModal #catalog').append($("<option>select</option>"));
      data.values.forEach(function(item){
       var option = $("<option value=" +  item.caption_name + ">" + item.caption_name + "</option>");
       $('#myModal select.catalogNameList').append(option);
      });
    }, 'json');
  });

  $('#myModal #catalog').on('change', function() {
    var parameters = {
      username  : "hotChocolate",
      pathName: "/"+ $('#dataSource').val() + "/" + $(this).val()};
    console.log(parameters);
    $.get('/discover/getServerDetails', parameters, function(data) {
      console.log(data);
      $('#myModal #cube').children().remove();
      $('#myModal #cube').append($("<option>select</option>"));
      data.values.forEach(function(item){
       console.log(item.caption_name);
       var option = $("<option value=" +  item.caption_name + ">" + item.caption_name + "</option>");
       $('#myModal select.cubeNameList').append(option);
      });
    }, 'json');
  });

  $('.modal-footer #save').on('click', function(){
    // console.log($('#cube option:selected').text());
    var parameters = {
                      username  : "hotChocolate",
                      pathName: "/"+ $('#dataSource').val() + "/" + $('#catalog').val() + "/" + $('#cube option:selected').text()
                    };
    // console.log(parameters);
    $('#left-menu-wrapper #cubeName').text($('#cube option:selected').text());
    $.get('/discover/getDimensions', parameters, function(data) {
      $('div#dim-div ul').children().remove();
      data.values.forEach(function(item){
       var li = generateLI(item.caption_name);
       li.data('unique_name', item.unique_name);
       li.data('path-name', parameters.pathName + "/" + item.unique_name);
       if(item.caption_name !== "Measures") {
         li.appendTo('div#dim-div ul');
       }
      });
    }, 'json');
    $.get('/discover/getMeasures', parameters, function(data) {
      $('div#measures-div ul').children().remove();
      data.values.forEach(function(item){
       var li = $("<li><a href='#'>" + item.caption_name + "</a></li>");
       li.data('unique_name', item.unique_name);
       li.data('path-name', parameters.pathName + "/[Measures]/[Measures]/[Measures].[MeasuresLevel]/" + item.unique_name);
         li.appendTo('div#measures-div ul').find('a').draggable({
           appendTo: "body",
           helper: "clone"
         });
      });
    }, 'json');
  });

  $('#dim-div, #measures-div').on('click', 'label', function() {
    if($(this).parent().children('ul').length === 0) {
      var parameters = {username  : "hotChocolate", pathName: $(this).parent().data('path-name')};
      console.log(parameters.pathName);
      var childUL = generateUL();
      childUL.appendTo($(this).parent()).toggle();
      $.get('/discover/getDimensions', parameters, function(data) {
        var level = data.key;
        var li;
        data.values.forEach(function(item){
         if(level == "MEMBER") {
            li = $("<li><a href='#'>" + item.unique_name + "</a></li>");
            li.appendTo(childUL).find('a').draggable({
              appendTo: "body",
              helper: "clone"
            });
         } else {
            li = generateLI(item.unique_name);
            li.appendTo(childUL).find('a').draggable({
              appendTo: "body",
              helper: "clone"
            });;
         }
         li.data('unique_name', item.unique_name);
         li.data('path-name', parameters.pathName + "/" + item.unique_name);
        });
      }, 'json');
    }
  });

  $('#dim-div,#measures-div').on('click', 'label' , function () {
    $this = $(this).children('span');
    $this.parent().parent().children('ul.nav-left-ml').toggle(300);
    var cs = $this.attr("class");
    if(cs == 'nav-toggle-icon glyphicon glyphicon-chevron-right') {
      $this.removeClass('glyphicon-chevron-right').addClass('glyphicon-chevron-down');
    }
    if(cs == 'nav-toggle-icon glyphicon glyphicon-chevron-down') {
      $this.removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-right');
    }
  });
//////////////////

  $('#saveCredentials').on('click',function(){
    $('#myModal #url').val($('.credentialDetails #serverURL').val());
    $.post(
        "/serverCredentials/save",
        {
          //window.username
          username: 'hotChocolate',
          connection_id: $("option:selected",'#connName').val()
        }
      ).done(function( data ) {
          var parameters = {
            // xmlaServer  : $('.credentialDetails #serverURL').val(),
            pathName    : "/",
            username      : "hotChocolate"
          };
          $.get( '/discover/getServerDetails',parameters, function(data) {
            $('#myModal #dataSource').children().remove();
            $('#myModal select.dataSourceNameList').append($("<option>select</option>"));
            data.values.forEach(function(item){
                 var option = $("<option value=" +  item.caption_name + ">" + item.caption_name + "</option>");
                 $('#myModal select.dataSourceNameList').append(option);
            });
          },'json');
        });
  });

  $('#editConnection').on('click',function(){
    $.get('/serverCredentials/getAvailableConnections',function(data){
      $('#connName').css({display: "inline"});
      $('#newConnName').css({display:"none"});
      $('#connName').children().remove();
      $('#connName').append($("<option data-url='akdjf'>select</option>"));
      for(var x in data){
        console.log(x);
        var item=data[x];
        console.log(item);
        var option = $("<option value=" +  item._id + ">" + item.connectionName + "</option>");
        console.log(item.serverURL);
        option.data('url',item.serverURL);
        option.data('userid',item.userid);
        option.data('password',item.password);
        $('#connName').append(option);
      }
    });
   });

   $('#connName').on('change',function(){
     $('#serverURL').val($("option:selected",this).data("url"));
     $('#userId').val($("option:selected",this).data("userid"));
     $('#password').val($("option:selected",this).data("password"));
   });

   // adding new connection
   $("#addConn").on('click',function(){
     $('#serverURL').prop('readonly',false);
     $('#userId').prop('readonly',false);
     $('#password').prop('readonly',false);
     $('#validate').css({display: "inline"});
     $('#saveCredentials').css({display:"none"});
     $('#newConnName').css({display: "inline"});
     $('#connName').css({display:"none"});
   });

   $('#validate').on('click',function(){
     //Validate the inputs here and Error Handlers of input(s)
     var parameters = {
       connName : $(".credentialDetails #newConnName").val(),
       url      : $(".credentialDetails #serverURL").val(),
       userid   : $(".credentialDetails #userId").val(),
       password : $(".credentialDetails #password").val()

     };
     $.get('/serverCredentials/addConnection',parameters,function(data){
        console.log(data);
        $('#myModal #url').val($('.credentialDetails #serverURL').val());
        $('#serverCredentials').modal('hide');
        $('#myModal').modal();
     });
     $('#myModal #dataSource').children().remove();
     $('#myModal #catalog').children().remove();
     $('#myModal #cube').children().remove();


   });

  $('#executeButton').on('click', function() {
    //build mdx query from dragged items
    var colItems = $('div.columns:eq(0)').find('li'),
        rowItems = $('div.columns:eq(1)').find('li'),
        filterItems = $('div.columns:eq(2)').find('li');

    var mdxQuery;
    var col_query = "",
        row_query = "",
        filter_query = "",
        col_query = "{}",
        row_query = "{}";

    if(colItems.eq(0).text() !== "Drag measures/dimensions here") {
      colItems.each(function(index, value) {
          if($(this).data('is_member')) {
            col_query = "UNION(" + "{" + $(this).data('sub_query') + "}," + col_query + ")";
          } else {
            col_query = "UNION(" + $(this).data('sub_query') + ".members," + col_query + ")";
          }
      });
    }
    console.log(col_query);
    if(rowItems.eq(0).text() !== "Drag measures/dimensions here") {
      rowItems.each(function(index, value) {
        if($(this).data('is_member')) {
          row_query = "UNION(" + "{" + $(this).data('sub_query') + "}," + row_query + ")";
        } else {
          row_query = "UNION(" + $(this).data('sub_query') + ".members," + row_query + ")";
        }
      });
    }
    console.log(row_query);
    mdxQuery = "select " + col_query + " on columns, " + row_query + " on rows" + " from [Quadrant Analysis]" ;
    console.log(mdxQuery);
    jsondata(mdxQuery);
  });

}());
