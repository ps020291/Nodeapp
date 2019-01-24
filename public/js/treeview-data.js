/*Treeview Init*/



$(function() {

    "use strict";

    

    // var defaultData = [

    //   {

    //     text: 'Parent 1',

    //     href: '#parent1',

    //     tags: ['4'],

    //     nodes: [

    //       {

    //         text: 'Child 1',

    //         href: '#child1',

    //         tags: ['2'],

    //         nodes: [

    //           {

    //             text: 'Grandchild 1',

    //             href: '#grandchild1',

    //             tags: ['0']

    //           },

    //           {

    //             text: 'Grandchild 2',

    //             href: '#grandchild2',

    //             tags: ['0']

    //           }

    //         ]

    //       },

    //       {

    //         text: 'Child 2',

    //         href: '#child2',

    //         tags: ['0']

    //       }

    //     ]

    //   },

    //   {

    //     text: 'Parent 2',

    //     href: '#parent2',

    //     tags: ['0']

    //   },

    //   {

    //     text: 'Parent 3',

    //     href: '#parent3',

    //      tags: ['0']

    //   },

    //   {

    //     text: 'Parent 4',

    //     href: '#parent4',

    //     tags: ['0']

    //   },

    //   {

    //     text: 'Parent 5',

    //     href: '#parent5'  ,

    //     tags: ['0']

    //   }

    // ];



    // var alternateData = [

    //   {

    //     text: 'Parent 1',

    //     tags: ['2'],

    //     nodes: [

    //       {

    //         text: 'Child 1',

    //         tags: ['3'],

    //         nodes: [

    //           {

    //             text: 'Grandchild 1',

    //             tags: ['6']

    //           },

    //           {

    //             text: 'Grandchild 2',

    //             tags: ['3']

    //           }

    //         ]

    //       },

    //       {

    //         text: 'Child 2',

    //         tags: ['3']

    //       }

    //     ]

    //   },

    //   {

    //     text: 'Parent 2',

    //     tags: ['7']

    //   },

    //   {

    //     text: 'Parent 3',

    //     icon: 'glyphicon glyphicon-earphone',

    //     href: '#demo',

    //     tags: ['11']

    //   },

    //   {

    //     text: 'Parent 4',

    //     icon: 'glyphicon glyphicon-cloud-download',

    //     href: '/demo.html',

    //     tags: ['19'],

    //     selected: true

    //   },

    //   {

    //     text: 'Parent 5',

    //     icon: 'glyphicon glyphicon-certificate',

    //     color: 'pink',

    //     backColor: 'red',

    //     href: 'http://www.tesco.com',

    //     tags: ['available','0']

    //   }

    // ];



    // var json = '[' +

    //   '{' +

    //     '"text": "Parent 1",' +

    //     '"nodes": [' +

    //       '{' +

    //         '"text": "Child 1",' +

    //         '"nodes": [' +

    //           '{' +

    //             '"text": "Grandchild 1"' +

    //           '},' +

    //           '{' +

    //             '"text": "Grandchild 2"' +

    //           '}' +

    //         ']' +

    //       '},' +

    //       '{' +

    //         '"text": "Child 2"' +

    //       '}' +

    //     ']' +

    //   '},' +

    //   '{' +

    //     '"text": "Parent 2"' +

    //   '},' +

    //   '{' +

    //     '"text": "Parent 3"' +

    //   '},' +

    //   '{' +

    //     '"text": "Parent 4"' +

    //   '},' +

    //   '{' +

    //     '"text": "Parent 5"' +

    //   '}' +

    // ']';



    // $('#treeview1').treeview({

    //   data: defaultData

    // });



    // $('#treeview4').treeview({

    //   levels: 1,

    //   data: defaultData

    // });



    // $('#treeview3').treeview({

    //   levels: 99,

    //   data: defaultData

    // });



    var $tree = $('#treeview2').treeview({

      searchResultColor: '#FFFFFF',

      searchResultBackColor: '#D9534F', //'#FFFFFF',

      data: catjson,

      enableLinks: true

    });

  $('#treeview2').on('nodeSelected', function(event, data) {

       getVal1(event, data)

  });

  $("#rootbtn").click(function(){

      var $tree = $('#treeview2').treeview({

      data: catjson,

      enableLinks: true

    });

  });



  var selectors = {

      'tree': '#treeview-searchable',

      'input': '#input-search',

      'reset': '#btn-clear-search'

  };

  var lastPattern = '';

   var search = function (e) {

    var pattern = $(selectors.input).val();

    if (pattern === lastPattern) {

        return;

    }

    lastPattern = pattern;



     // collapse and enable all before search //

    function reset(tree) {

        $("#treeview2").treeview("collapseAll", { silent: false });

        $("#treeview2").treeview("enableAll", { silent: true });



        // tree.enableAll();

    }



    // find all nodes that are not related to search and should be disabled:

    // This excludes found nodes, their children and their parents.

    // Call this after collapsing all nodes and letting search() reveal.

    //

    function collectUnrelated(nodes) {

        var unrelated = [];

        $.each(nodes, function (i, n) {

            if (!n.searchResult && !n.state.expanded) { // no hit, no parent

                unrelated.push(n.nodeId);

            }

            if (!n.searchResult && n.nodes) { // recurse for non-result children

                $.merge(unrelated, collectUnrelated(n.nodes));

            }

        });

        return unrelated;

    }

    

    var tree = $(selectors.catjson).treeview(true);

    reset(tree);

    if (pattern.length < 3) { // avoid heavy operation

        $("#treeview2").treeview("clearSearch", { silent: true });

        // tree.clearSearch();

    } else {

          $("#treeview2").treeview('search', [ pattern, {

            ignoreCase: true,     // case insensitive

            exactMatch: false,    // like or equals

            revealResults: true  // reveal matching nodes

          }]);



          // tree.search(pattern);

          // get all root nodes: node 0 who is assumed to be

          //   a root node, and all siblings of node 0.

          // var roots = tree.getSiblings(0);

          // roots.push(tree.getNode(0));

            var roots =  $("#treeview2").treeview("getSiblings", node[0]);;

            roots.push($("#treeview2").treeview('getNode', nodeId[0]));

          //first collect all nodes to disable, then call disable once.

           //  Calling disable on each of them directly is extremely slow! 

          var unrelated = collectUnrelated(roots);

          tree.disableNode(unrelated, {silent: true});

      }

  };



  // typing in search field

  $(selectors.input).on('keyup', search);



$(selectors.reset).on('click', function (e) {

    $(selectors.input).val('');

    var tree = $(selectors.tree).treeview(true);

    reset(tree);

    tree.clearSearch();

});



// $('.nav-tabs li:eq(1) a').tab('show');

// To select the second tab

 

});



$(document).ready(function(){

if((classname=="category" && method=="index" && pagination>0) || get!="")

{

  $('#myTabs_8 li').removeClass('active');    

  $('#myTabs_8 li:nth-child(2)').addClass('active');

  var divid = $('#myTabs_8 li:nth-child(2) a').attr('href');

  $("#myTabContent_8 div").removeClass('active in');

  $(divid).addClass('active in');

}





});

  



function getVal1(event, data) {

var funCall = data.href;

var matches = funCall.match(/\((.*?)\)/);

if (matches) {

  var submatch = matches[1];

  getVal(submatch);

}



}

function getVal(argument) {

      // console.log(argument);

      if(argument>0)

      {

        $("#category_add").fadeOut(300);

        $("#category_edit").fadeIn(600);

        $("#cat_id").val(argument);

        $("#parent_id1").val(argument);

        var url1 = base_url+"category/getcategorybyid/"+argument;

        // console.log(url1);

        $.ajax({

          url : url1,

          type:"POST",

          async : false

        }).done(function(res){

          var obj = JSON.parse(res);

          $("#parent_id").val(obj[0].parent_id);

          var parent_text = $("#parent_id option:selected").text();

          $("#select2-parent_id-container").html(parent_text);

          $("#cat_name").val(obj[0].cat_name);
          
          $("#cat_name_hn").val(obj[0].cat_name_hindi);

          $("#cat_featured").val(obj[0].cat_featured);

          $("#in_navigation").val(obj[0].in_navigation);

          $("#url_key").val(obj[0].url_key);

          $("#status").val(obj[0].status);

          $("#page_title").val(obj[0].meta_title);

          $("#page_keyword").val(obj[0].meta_keyword);

          $("#page_description").val(obj[0].meta_description);

          if(obj[0].image=="" || obj[0].image==null)

          {

            $(".imgdiv").hide();

          }else{

            $(".imgdiv").show();

            $("#img").html("<img src='"+base_url+"categories/"+obj[0].image+"' style='width:50px;' >");

          }

          $("#updatebtn").removeClass("disabled");

          $("#delbtn").html('<a href="JavaScript:void(0)"  class="btn btn-danger btn-rounded" onclick="delCategory('+argument+')" ><span>Delete</span></a>');

          // $("#attribute").show();

          // $("#photos_8").show();

          getcategoryListbyid(argument);

          loadcategoryProducts(1);

          // getAttributeListbyid(argument);

        });



      }



}



function getcategoryListbyid(argument) {

var url1 = base_url+"category/getcategoryListbyid/"+argument;

$.ajax({

  url : url1,

  type:"POST",

  async : false

}).done(function(res){

  //console.log(res);

    $("#tbody").html(res);

    $("#myPager1").hide();

  });



}



function loadcategoryProducts(page)

{

var cat_id = $("#cat_id").val();

if(cat_id>0)

{

var productUrl = base_url+"category/productsbyCategory/"+cat_id+'/'+page;

console.log(productUrl);

$.ajax({

 url : productUrl+"/"+page,

 method:"GET",

 dataType:"json",

 success:function(data)

   {

    // alert(data);

    $('#categoryProducts').html(data.products);

    $('#cat_pagination_link').html(data.pagination_link);

    $('[data-toggle="tooltip"]').tooltip();

    

   }

});

}

}



$(document).ready(function(){

loadcategoryProducts(1);

$(document).on("click", ".pagination li a", function(event){

  event.preventDefault();

  var page = $(this).data("ci-pagination-page");

  loadcategoryProducts(page);

});

});



function getAttributeListbyid(argument) {

var url1 = base_url+"category/getAttributeListbyid/"+argument;

$.ajax({

  url : url1,

  type:"POST",

  async : false

}).done(function(res){

  //console.log(res);

    $("#tbodyattr").html(res);

  });



}



function addsubcategory() {

var parent_id = $('#parent_id1').val();

if(parent_id=="0" || parent_id=="")

{

alert_msg("Please select Category");

}else{

$("#category_edit").hide();

$("#category_add").show();

// $('#parent_id').val('');

}

}



function addrootcategory() {

//console.log("here");

$('#parent_id1').val('0');

$("#category_edit").fadeOut(300);

$("#category_add").fadeIn(600);

}






