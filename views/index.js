$(document).ready(function(){

    //hides dropdown content
    $(".menu_selected").hide();
    
    //unhides first option content
    $("#user").show();
    
    //listen to dropdown for change
    $("#menu_option").change(function(){
      //rehide content on change
      $('.menu_selected').hide();
      //unhides current item
      $('#'+$(this).val()).show();
    });
    
  });