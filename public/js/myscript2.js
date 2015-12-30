(function(){
  $('.columns').droppable({
    drop: function(event, ui) {
      $this = $(this).children('ul');
      $this.find(".placeholder").remove();
      //$("<li></li>").text(ui.draggable.text()).appendTo($this);
      var parentLI = $(ui.draggable).closest('li');
      var str1 = parentLI.data('unique_name');
      var str2 = parentLI.data('caption_name');
      var li = $("<li>" + ui.draggable.text() + "<button type='button' class='close'>&times;</button></li>");
      li.data('unique_name', str1);
      li.data('caption_name', str2);
      if(parentLI.children('label').length == 0) {
        li.data('is_member', "yes");
      } else {
        li.data('is_member', "no");
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
    if(len === 0) {
      $("<li class='placeholder'>Drag measures/dimensions here</li>").appendTo(pt.children('ul'));
    }
    var ht = parseInt(pt.outerHeight());
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

  $('#url').on('keyup', function(e){
   if(e.keyCode === 13) {
     var parameters = { xmlaServer: $(this).val(), pathName: "/" };
       $.get( '/discover/getServerDetails',parameters, function(data) {
         $('#myModal #dataSource').children().remove();
         $('#myModal select.dataSourceNameList').append($("<option>select</option>"));
         data.values.forEach(function(item){
          var option = $("<option value=" +  item.caption_name + ">" + item.caption_name + "</option>");
          $('#myModal select.dataSourceNameList').append(option);
       });
     },'json');
    }
  });

  $('#myModal #dataSource').on('change', function() {
    var parameters = {xmlaServer: $('#url').val(), pathName: "/"+$(this).val()};
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
    var parameters = {xmlaServer: $('#url').val(), pathName: "/"+ $('#dataSource').val() + "/" + $(this).val()};
    $.get('/discover/getServerDetails', parameters, function(data) {
      $('#myModal #cube').children().remove();
      $('#myModal #cube').append($("<option>select</option>"));
      data.values.forEach(function(item){
       var option = $("<option value=" +  item.caption_name + ">" + item.caption_name + "</option>");
       $('#myModal select.cubeNameList').append(option);
      });
    }, 'json');
  });

  $('.modal-footer #save').on('click', function(){
    var parameters = {
                      xmlaServer: $('#url').val(),
                      pathName: "/"+ $('#dataSource').val() + "/" + $('#catalog').val() + "/" + $('#cube option:selected').text()
                    };
    $('#left-menu-wrapper #cubeName').text($('#cube option:selected').text());
    $.get('/discover/getDimensions', parameters, function(data) {
      $('div#dim-div ul').children().remove();
      data.values.forEach(function(item){
       var li = generateLI(item.caption_name);
       li.data('unique_name', item.unique_name);
       li.data('caption_name', item.caption_name);
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
       li.data('caption_name', item.caption_name);
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
      var parameters = {xmlaServer: $('#url').val(), pathName: $(this).parent().data('path-name')};
      var childUL = generateUL();
      childUL.appendTo($(this).parent()).toggle();
      $.get('/discover/getDimensions', parameters, function(data) {
        var level = data.key;
        var li;
        data.values.forEach(function(item){
         if(level == "MEMBER") {
            li = $("<li><a href='#'>" + item.caption_name + "</a></li>");

         } else {
            li = generateLI(item.caption_name);
         }
         li.appendTo(childUL).find('a').draggable({
           appendTo: "body",
           helper: "clone"
         });
         li.data('unique_name', item.unique_name);
         li.data('caption_name', item.caption_name);
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

  $('#executeButton').on('click', function() {
    //build mdx query from dragged items
    jsondata(mdxGenerator());
  });

  function mdxGenerator() {
    var colItems = $('div.columns:eq(0)').find('li'),
        rowItems = $('div.columns:eq(1)').find('li'),
        filterItems = $('div.columns:eq(2)').find('li');

    var mdxQuery,
        col_query = "{}",
        row_query = "{}",
        filter_query = "{}";

    var colArray = [],
        rowArray = [],
        filterArray = [];

    if(colItems.eq(0).data('caption_name') !== undefined) {
      colItems.each(function(index, value) {
          colArray.push("" + $(this).data('unique_name') + " " + $(this).data('caption_name') + " " + $(this).data('is_member'));
          if($(this).data('is_member') === "yes") {
            col_query = "UNION(" + "{" + $(this).data('unique_name') + "}," + col_query + ")";
          } else {
            col_query = "UNION(" + $(this).data('unique_name') + ".members," + col_query + ")";
          }
      });
    }
    if(rowItems.eq(0).data('caption_name') !== undefined) {
      rowItems.each(function(index, value) {
        rowArray.push("" + $(this).data('unique_name') + " " + $(this).data('caption_name') + " " + $(this).data('is_member'));
        if($(this).data('is_member') === "yes") {
          row_query = "UNION(" + "{" + $(this).data('unique_name') + "}," + row_query + ")";
        } else {
          row_query = "UNION(" + $(this).data('unique_name') + ".members," + row_query + ")";
        }
      });
    }
    mdxQuery = "select " + col_query + " on columns, " + row_query + " on rows" + " from [Quadrant Analysis]" ;
    console.log(mdxQuery);
    return mdxQuery;
  }

  $('#saveQueryModal #saveQueryButton').on('click', function() {

    var colItems = $('div.columns:eq(0)').find('li'),
        rowItems = $('div.columns:eq(1)').find('li'),
        filterItems = $('div.columns:eq(2)').find('li');

    var colArray = [],
        rowArray = [],
        filterArray = [];

        if(colItems.eq(0).data('caption_name') !== undefined) {
          colItems.each(function(index, value) {
              colArray.push("" + $(this).data('unique_name') + " " + $(this).data('caption_name') + " " + $(this).data('is_member'));

          });
        }
        if(rowItems.eq(0).data('caption_name') !== undefined) {
          rowItems.each(function(index, value) {
            rowArray.push("" + $(this).data('unique_name') + " " + $(this).data('caption_name') + " " + $(this).data('is_member'));

          });
        }
        var qName = $('#saveQueryModal #queryName').val();
        var parameters = {
          queryName: qName,
          userName: "Batman",
          colArray: colArray,
          rowArray: rowArray,
          filterArray: filterArray,
          queryMDX: mdxGenerator()
        };
        console.log(parameters);
        $.post('/query/new', parameters, function(data) {
          var alert = $('#saveQueryModal .alert');
          alert.find('strong').remove();
          alert.append($("<strong>" + data.info + "</strong>"));
          alert.toggle();
        }, 'json');
  });

  $.get('/query/byUser', {userName: "Batman"}, function(data) {
    if(data.length > 0) {
      if (data.status && data.status === 'error') {
        console.log(data.error);
      } else {
        var ul = $('div.navbar ul#queryList');
        ul.children().remove();
        data.forEach(function(obj) {
          var li = $("<li><a href='#'>" + obj.queryName + "</a></li>");
          li.appendTo(ul);
        });
      }
    }
  }, 'json');

  $('div.navbar ul#queryList').on('click', 'a', function(e) {
    e.preventDefault();
    $.get('/query/find', {queryName: $(this).text()}, function(data) {
      var colArray = data.onColumns,
          rowArray = data.onRows;

      var ul = $('div.columns:eq(0)').find('ul');
      ul.children().remove();
      colArray.forEach(function(item) {
        var str = item.split(" ");
        var li = $("<li>" + str[1] + "<button type='button' class='close'>&times;</button></li>");
        li.data('unique_name', str[0]);
        li.data('caption_name', str[1]);
        li.data('is_member', str[2]);
        li.appendTo(ul);
      });

      var ul = $('div.columns:eq(1)').find('ul');
      ul.children().remove();
      rowArray.forEach(function(item) {
        var str = item.split(" ");
        var li = $("<li>" + str[1] + "<button type='button' class='close'>&times;</button></li>");
        li.data('unique_name', str[0]);
        li.data('caption_name', str[1]);
        li.data('is_member', str[2]);
        li.appendTo(ul);
      });
    }, 'json');
  })

  $('#saveQueryModal .alert').toggle();
  $('div.alert .close').on('click', function() {
    $('#saveQueryModal div.alert').hide();
  });
}());
