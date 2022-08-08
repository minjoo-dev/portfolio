var browse = navigator.userAgent.toLowerCase(); 

$(document).ready(function(){
   var e = new TimelineMax({delay:1, repeat:-1}),t=document.getElementById("blob-1a");
   e.to(t,6,{morphSVG:"#blob-1b"}).to(t,6,{morphSVG:"#blob-1c"}).to(t,6,{morphSVG:"#blob-1d"}).to(t,6,{morphSVG:"#blob-1e"}).to(t,6,{morphSVG:"#blob-1f"}).to(t,6,{morphSVG:"#blob-1a"});
   
   var n = new TimelineMax({delay:1, repeat:-1}),i=document.getElementById("blob-2a");
   n.to(i,7,{morphSVG:"#blob-2b"}).to(i,7,{morphSVG:"#blob-2c"}).to(i,7,{morphSVG:"#blob-2d"}).to(i,7,{morphSVG:"#blob-2e"}).to(i,7,{morphSVG:"#blob-2f"}).to(i,7,{morphSVG:"#blob-2a"});
   
   var a = new TimelineMax({delay:1, repeat:-1}),s=document.getElementById("blob-3a");
   a.to(s,5,{morphSVG:"#blob-3b"}).to(s,5,{morphSVG:"#blob-3c"}).to(s,5,{morphSVG:"#blob-3d"}).to(s,5,{morphSVG:"#blob-3e"}).to(s,5,{morphSVG:"#blob-3f"}).to(s,5,{morphSVG:"#blob-3a"});
   
   if (browse.indexOf("chrome") > -1 ) 
   {
      //
   }
   else
   {
      document.getElementById("blobs").setAttribute('class','fixed pin w-full h-full_ex z-0 transition-transform-long transform_ex');
      document.getElementById("color1").setAttribute('class','absolute flex items-center justify-center z-1 w-120vw_c1 h-140vh transition-all text-red-dark');
      document.getElementById("color2").setAttribute('class','absolute flex items-center justify-center w-130vw_c2  h-150vh_c2 transition-all text-yellow');
      document.getElementById("color3").setAttribute('class',' flex items-center justify-center w-150vw_c3 h-120vh_c3 transition-all text-blue-dark');
      document.getElementById("blob-archive").setAttribute('class','block fill-current w-full h-full_ex transition-transform');
      document.getElementById("blob-menu").setAttribute('class','block fill-current w-full_ex h-full_ex transition-transform');
      document.getElementById("blob-contact").setAttribute('class','block fill-current w-full h-full transition-transform');
   }
});
   
$(window).scroll(function () { 
   var scrollT = $(this).scrollTop();
   var scrollH = $(this).height();
   var contentH = $('#blobs').height();
   
   if(scrollT + scrollH + 1 >= contentH -300) {
      if (browse.indexOf("chrome") > -1 ) 
      {
         document.getElementById("blob-archive").setAttribute('class','block fill-current w-full h-full transition-transform translate-none');
         document.getElementById("blob-menu").setAttribute('class','block fill-current w-full h-full transition-transform translate-none');
         document.getElementById("blob-contact").setAttribute('class','block fill-current w-full h-full transition-transform translate-none');
      }
      else
      {
         document.getElementById("blob-archive").setAttribute('class','block fill-current w-full h-full_c1 transition-transform translate-none');
         document.getElementById("blob-menu").setAttribute('class','block fill-current w-full_c2 h-full_c2 transition-transform translate-none');
         document.getElementById("blob-contact").setAttribute('class','block fill-current w-full h-full_c3 transition-transform translate-none');
      }
      
      $(".text-yellow").removeClass("text-yellow").addClass("text-yellow-light");
      $(".text-orange").removeClass("text-orange").addClass("text-orange-light");
      $(".text-coral").removeClass("text-coral").addClass("text-coral-light");
   }
   if(scrollT == 0)
   {
      if (browse.indexOf("chrome") > -1 ) 
      {
         document.getElementById("blob-archive").setAttribute('class','block fill-current w-full h-full transition-transform');
         document.getElementById("blob-menu").setAttribute('class','block fill-current w-full h-full transition-transform');
         document.getElementById("blob-contact").setAttribute('class','block fill-current w-full h-full transition-transform');
      }
      else
      {
         document.getElementById("blob-archive").setAttribute('class','block fill-current w-full h-full_ex transition-transform');
         document.getElementById("blob-menu").setAttribute('class','block fill-current w-full_ex h-full_ex transition-transform');
         document.getElementById("blob-contact").setAttribute('class','block fill-current w-full h-full transition-transform');
      }
      
      $(".text-yellow-light").removeClass("text-yellow-light").addClass("text-yellow");
      $(".text-orange-light").removeClass("text-orange-light").addClass("text-orange");
      $(".text-coral-light").removeClass("text-coral-light").addClass("text-coral");
   }
});