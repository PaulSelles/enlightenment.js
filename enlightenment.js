var Wallpaper = (function() {

  var Mask = (function() {
    var triangle = function(ctx,x1,x2,y1,y2) {
      
        var xOffset=(1/3)*(x1+x2);
        var yOffset=(1/3)*(y1+y2);
        
    	ctx.save();
      
        ctx.beginPath();
        ctx.moveTo(0,0);
        ctx.lineTo(x1,y1);
        ctx.lineTo(x2,y2);
        ctx.lineTo(0,0);
    	ctx.closePath();
    
    	ctx.clip();
    	drawKey(ctx,xOffset,yOffset);
    	
    	ctx.restore();
      };
    
    return {
        rectangle : function(ctx, width, height) {
    	  ctx.save();
    	  
          ctx.beginPath();
          ctx.rect(-width/2,-height/2,width,height);
    	  ctx.closePath();
          
    	  ctx.clip();
    	  drawKey(ctx);
    	  
    	  ctx.restore();
        },
      
        triangle1 : function(ctx, width, height) {
      	height = typeof height !== 'undefined' ? height : width;
      
          var x1=width;
          var y1=0;
          var x2=width/2;
          var y2=height;
      
          triangle(ctx,x1,x2,y1,y2);
        },
        
        triangle2 : function(ctx, width, height) {
      	height = typeof height !== 'undefined' ? height : width;
      
        
          var x1=0;
          var y1=height;
          var x2=-width;
          var y2=0;
         
          triangle(ctx,x1,x2,y1,y2);
        },
        
        triangle3 : function(ctx, width, height) {
      	height = typeof height !== 'undefined' ? height : width;
      
          var x1=0;
          var y1=height;
          var x2=-width;
          var y2=height;
         
          triangle(ctx,x1,x2,y1,y2);
        },
        
        triangle4 : function(ctx, length) {
        
          var x1=-length;
          var y1=0;
          var x2=-length/2;
          var y2=-length*Math.sqrt(3)/2;
          
          triangle(ctx,x1,x2,y1,y2);
        },
        
        triangle5 : function(ctx, width, height) {
      	height = typeof height !== 'undefined' ? height : width;
        
          var x1=width/2;
          var y1=height;
          var x2=-width/2;
          var y2=height;
          
          triangle(ctx,x1,x2,y1,y2);
        },
        
        rombic : function(ctx, length) {
        
          var x1=-length/2;
          var y1=length*Math.sqrt(3)/2;
          var x2=-length;
          var y2=0;
          var x3=-length/2;
          var y3=-length*Math.sqrt(3)/2;
          
          var xOffset=(1/3)*(x1+x2);
          
          ctx.save();
        
          ctx.beginPath();
          ctx.moveTo(0,0);
          ctx.lineTo(x1,y1);
          ctx.lineTo(x2,y2);
          ctx.lineTo(x3,y3);
          ctx.lineTo(0,0);
      	  ctx.closePath();
      
      	  ctx.clip();
      	  drawKey(ctx,xOffset,0);
      	
      	  ctx.restore();
  	}
      };
  })
  ()
 
  var rectGrid = function(ctx, width, height, patternAngle, patternFunction) {
    ctx.translate(canvas.width/2,canvas.height/2);
    ctx.rotate(patternAngle*Math.PI/180);

    var widthPad=canvas.height*(Math.abs(Math.sin(patternAngle*Math.PI/180)));
    var heightPad=canvas.width*(Math.abs(Math.sin(patternAngle*Math.PI/180)));

    for (var y=-canvas.height-heightPad-height/2; y<=canvas.height+heightPad+height/2; y+=height) {
      for (var x=-canvas.width-widthPad-width/2; x<=canvas.width+widthPad+width/2; x+=width) {
        patternFunction(x,y);
      }
    }
    ctx.translate(-canvas.width/2,-canvas.height/2);
  };

  var obliqueGrid = function(ctx, width, height, patternAngle, skewAngle, patternFunction) {
    ctx.translate(canvas.width/2,canvas.height/2);
    ctx.rotate(patternAngle*Math.PI/180);

    var widthPad=canvas.height*(Math.abs(Math.sin(patternAngle*Math.PI/180)));
    var heightPad=canvas.width*(Math.abs(Math.sin(patternAngle*Math.PI/180)));

    var xOffset=height*Math.tan(skewAngle*Math.PI/180);
    var heightCounter=0;

    for (var y=-canvas.height-heightPad-height/2; y<=canvas.height+heightPad+height/2; y+=height) {
      for (var x=-canvas.width-widthPad-width/2-Math.ceil(height*Math.tan(skewAngle))*(width-xOffset); x<=canvas.width+widthPad+width/2+Math.ceil(height*Math.tan(skewAngle))*xOffset; x+=width) {
        patternFunction(x,y);
      }
    }
    ctx.translate(-canvas.width/2,-canvas.height/2);
  };
  
  var rhombicGrid = function(ctx, width, height, patternAngle, patternFunction) {
    ctx.translate(canvas.width/2,canvas.height/2);
    ctx.rotate(patternAngle*Math.PI/180);

    var widthPad=canvas.height*(Math.abs(Math.sin(patternAngle*Math.PI/180)));
    var heightPad=canvas.width*(Math.abs(Math.sin(patternAngle*Math.PI/180)));

    var heightCounter=0;
    for (var y=-canvas.height-heightPad-height/4; y<=canvas.height+heightPad+height/4; y+=height/2) {
      heightCounter++;
      for (var x=-canvas.width-widthPad-width/2; x<=canvas.width+widthPad+width/2; x+=width) {
        patternFunction(heightCounter%2==0?x:x-width/2,y);
      }
    }
    ctx.translate(-canvas.width/2,-canvas.height/2)
  };

  return {
    // Group 1
    p1 : function(ctx, width, height, patternAngle, skewAngle, skew) {
      height = typeof height !== 'undefined' ? height : width;
    patternAngle = typeof patternAngle !== 'undefined' ? patternAngle : 0;
    skewAngle = typeof skewAngle !== 'undefined' ? skewAngle : 0;
    skew = typeof skew !== 'undefined' ? skew : true;
	
      if (skewAngle < -90 || skewAngle > 90) { throw "The pattern angle must be between -45 and 45 degress." }
      obliqueGrid(ctx, width, height, patternAngle, skewAngle, function(x,y) {
      
        var offset=height*Math.tan(skewAngle*Math.PI/180)/2;
  
        // Draw original
        ctx.translate(x+offset,y);
        if (skew) { ctx.transform(1,0,Math.tan(skewAngle*Math.PI/180),1,0,0); }
        Mask.rectangle(ctx,width,height);
        if (skew) { ctx.transform(1,0,-Math.tan(skewAngle*Math.PI/180),1,0,0); }
        ctx.translate(-(x+offset),-y);
      });
    },
  
    // Group 2
    p2 : function(ctx, width, height, patternAngle, skewAngle, skew) {
      height = typeof height !== 'undefined' ? height : width;
    patternAngle = typeof patternAngle !== 'undefined' ? patternAngle : 0;
    skewAngle = typeof skewAngle !== 'undefined' ? skewAngle : 0;
    skew = typeof skew !== 'undefined' ? skew : true;

    if (skewAngle < -90 || skewAngle > 90) { throw "The pattern angle must be between -45 and 45 degress." }
        obliqueGrid(ctx, width, 2*height, patternAngle, skewAngle, function(x,y) {
      
        // Move the origin to the center plus offset of our desired pattern
        ctx.translate(x,y+height/2);
  
        // Initiate skew
        if (skew) { ctx.transform(1,0,Math.tan(skewAngle*Math.PI/180),1,0,0); }
        
        // Draw all elements off the pattern
        for (var i=0; i<2; i++) {
          Mask.rectangle(ctx,width,height);
          ctx.translate(0,-height);
          ctx.scale(-1,-1);
        }      
        
        // remove skew
        if (skew) { ctx.transform(1,0,-Math.tan(skewAngle*Math.PI/180),1,0,0); }
        
        // Recenter the origin       
        ctx.translate(-x,-(y+height/2));
      });
    },
  
    // Group 3
    pm : function(ctx, width, height, patternAngle) {
      height = typeof height !== 'undefined' ? height : width;
    patternAngle = typeof patternAngle !== 'undefined' ? patternAngle : 0;
	
      rectGrid(ctx, width, 2*height, patternAngle, function(x,y) {
        
        // Move the origin to the center plus offset of our desired pattern
        ctx.translate(x,y+height/2);
        
        // Draw all elements off the pattern
        for (var i=0; i<2; i++) {
          Mask.rectangle(ctx,width,height);
          ctx.translate(0,-height);
          ctx.scale(1,-1);
        }
        
        // Recenter the origin
        ctx.translate(-x,-(y+height/2));
      });
    },
  
    // Group 4
    pg : function(ctx, width, height, patternAngle) {
      height = typeof height !== 'undefined' ? height : width;
    patternAngle = typeof patternAngle !== 'undefined' ? patternAngle : 0;
  
      rectGrid(ctx, 2*width, height, patternAngle, function(x,y) {
  
        // Move the origin to the center plus offset of our desired pattern
        ctx.translate(x-width/2,y);
        
        // Draw all elements off the pattern
        for (var i=0; i<2; i++) {
          Mask.rectangle(ctx,width,height);
          ctx.translate(width,0);
          ctx.scale(1,-1);
        }
        
        // Recenter the origin
        ctx.translate(-(x+1.5*width),-y);
      });
    },
    
    // Group 5
    cm : function(ctx, width, height, patternAngle) {
    patternAngle = typeof patternAngle !== 'undefined' ? patternAngle : 0;	  
  
      rhombicGrid(ctx, width, height, patternAngle, function(x,y) {
  
        // Move the origin to the center plus offset of our desired pattern
        ctx.translate(x-width/2,y);
        
        // Draw all elements off the pattern
        for (var i=0; i<2; i++) {
          Mask.triangle1(ctx,width,height/2);
          ctx.scale(1,-1);
        }
        
        // Recenter the origin
        ctx.translate(-(x-width/2),-y);
  
      });
    },
  
    // Group 6
    pmm : function(ctx, width, height, patternAngle) {
      patternAngle = typeof patternAngle !== 'undefined' ? patternAngle : 0;	  

      rectGrid(ctx, width, height, patternAngle, function(x,y) {

        // Calculate the offset values
        var xOffset=width/4;
        var yOffset=height/4;
        ctx.translate(x-xOffset,y+yOffset);
        
        // Draw all elements off the pattern
        for (var i=0; i<2; i++) {
          for (var j=0; j<2; j++) {
            Mask.rectangle(ctx,width/2,height/2);
            ctx.translate(2*xOffset,0);
            ctx.scale(-1,1);
          }
          ctx.translate(0,-2*yOffset); 
          ctx.scale(1,-1);         
        }
        
        ctx.translate(-(x-xOffset),-(y+yOffset));
      });
    },
  
    // Group 7
    pmg : function(ctx, width, height, patternAngle) {
    patternAngle = typeof patternAngle !== 'undefined' ? patternAngle : 0;	  

      rectGrid(ctx, width, height, patternAngle, function(x,y) {
      
        // Move the origin to the center plus offset of our desired pattern
        var xOffset=width/4;
        var yOffset=height/4;
        ctx.translate(x-xOffset,y+yOffset);
        
        // Draw all elements off the pattern
        for (var i=0; i<2; i++) {
          for (var j=0; j<2; j++) {
            Mask.rectangle(ctx,width/2,height/2);
            ctx.translate(2*xOffset,0); 
            ctx.rotate(Math.PI);       
          }
            ctx.translate(0,-2*yOffset);
            ctx.scale(1,-1);  
        }
        
        // Recenter the origin
        ctx.translate(-(x-xOffset),-(y+yOffset));
      });
    },
  
    // Group 8
    pgg : function(ctx, width, height, patternAngle) {
    patternAngle = typeof patternAngle !== 'undefined' ? patternAngle : 0;	  
  	  
      rhombicGrid(ctx, width, height, patternAngle, function(x,y) {
        
        // Calculate the offset values
        var offset=height/4;     
        ctx.translate(x-width/2,y);
        
        for (var i=0; i<2; i++)
        {
          Mask.triangle1(ctx,width,height/2);
          ctx.rotate(Math.PI);
          ctx.translate(-width,0);
        }
        
        ctx.translate(-(x-width/2),-y);
        
      });
    },
    
    
    // Group 9
    cmm : function(ctx, width, height, patternAngle) {
    patternAngle = typeof patternAngle !== 'undefined' ? patternAngle : 0;	  
  	  
      rhombicGrid(ctx, width, height, patternAngle, function(x,y) {
        
        // Calculate the offset values
        ctx.translate(x,y);
        
        // Draw all elements off the pattern
        for (var i=0; i<2; i++) {
          for (var j=0; j<2; j++) {
            Mask.triangle2(ctx,width/2,height/2);
            ctx.scale(-1,1);
          }
          ctx.scale(1,-1);         
        }
        
        ctx.translate(-x,-y);     
      });
    },
  
    // Group 10
    p4 : function(ctx, length, patternAngle) {
    patternAngle = typeof patternAngle !== 'undefined' ? patternAngle : 0;	  
   	  
      rectGrid(ctx, length, length, patternAngle, function(x,y) {
      
        // Move the origin to the center plus offset of our desired pattern
        var offset=length/4;
        ctx.translate(x+offset,y+offset);
        
        for (var i=0; i<4; i++) {
          ctx.translate(length/2,0);
          Mask.rectangle(ctx,2*offset,2*offset);
          ctx.rotate(Math.PI/2);
        }
        
        // Recenter our current position
        ctx.translate(-(x+offset),-(y+offset)); 
    
      });
    },
    
    // Group 11
    p4m : function(ctx, length, patternAngle) {
    patternAngle = typeof patternAngle !== 'undefined' ? patternAngle : 0;	  
  	 
      rectGrid(ctx, length, length, patternAngle, function(x,y) {
      
        // Move the origin to the center of our desired pattern
        ctx.translate(x,y);
  
        // Draw the pattern
        for (var i=0; i<4; i++) {
          Mask.triangle3(ctx,length/2);
          ctx.scale(1,-1);
          Mask.triangle3(ctx,length/2);
          ctx.scale(1,-1);
          ctx.rotate(Math.PI/2);
        }
        
        // Recenter the origin
        ctx.translate(-x,-y);
      });
    },
  
    // Group 12
    p4g : function(ctx, length, patternAngle) {
    patternAngle = typeof patternAngle !== 'undefined' ? patternAngle : 0;	  
  	  
      rectGrid(ctx, length, length, patternAngle, function(x,y) {
    
        // Move the origin to the center plus offset of our desired pattern
        ctx.translate(x,y);
        
        for (var i=0; i<4; i++) {    
          Mask.triangle2(ctx,length/2,length/2);
          ctx.translate(-length/2,-length/2);
          ctx.scale(-1,1);
          Mask.triangle2(ctx,length/2,length/2);
          ctx.scale(-1,1);
          ctx.translate(length/2,length/2);
          ctx.rotate(Math.PI/2);
        }
        
        // Recenter our current position
        ctx.translate(-x,-y); 
    
      });
    },
    
    // Group 13
    p3 : function(ctx, length, patternAngle) {
    patternAngle = typeof patternAngle !== 'undefined' ? patternAngle : 0;	  
    
      var angle=Math.PI/6;
      var altitude=Math.sqrt(3)*length/2;
      var height=altitude-Math.sqrt(3)/3*length;
    
    rhombicGrid(ctx, 2*altitude, 3*length, patternAngle, function(x,y) {
    
        // Move the origin to the center plus offset of our desired pattern
        ctx.translate(x,y);
        
        // Rotate to get our hexagons to line up
        ctx.rotate(Math.PI/6);
        
        for (var j=0; j<3; j++) {
          Mask.rombic(ctx, length);
          ctx.rotate(2*Math.PI/3);
        }
        
        // Rotate back
        ctx.rotate(-Math.PI/6);
  
        // Recenter our current position
        ctx.translate(-x,-y); 
    
      });
    },
    
    // Group 14
    p3m1 : function(ctx, length, patternAngle) {
    patternAngle = typeof patternAngle !== 'undefined' ? patternAngle : 0;	  
    	  
      var angle=Math.PI/6;
      var altitude=Math.sqrt(3)*length/2;
      var height=altitude-Math.sqrt(3)/3*length;
    
    rhombicGrid(ctx, 2*altitude, 3*length, patternAngle, function(x,y) {
  
        // Move the origin to the center plus offset of our desired pattern
        ctx.translate(x,y);
        
        // Rotate to get our hexagons to line up
        ctx.rotate(Math.PI/6);
        
        for (var i=0; i<3; i++) {
          //ctx.translate(length/2,(i%2==0?-1:1)*altitude/2);
          for (var j=0; j<2; j++) {
            Mask.triangle4(ctx,length);
            ctx.scale(-1,1);
            ctx.rotate(Math.PI/3);
          }
          ctx.rotate(2*Math.PI/3);
        }
        
        // Rotate back
        ctx.rotate(-Math.PI/6);
  
        // Recenter our current position
        ctx.translate(-x,-y); 
    
      });
    },
    
    // Group 15
    p31m : function(ctx, length, patternAngle) {
    patternAngle = typeof patternAngle !== 'undefined' ? patternAngle : 0;	  
     
      var angle=Math.PI/6;
      var altitude=Math.sqrt(3)*length/2;
      var height=altitude-Math.sqrt(3)/3*length;
    
      rhombicGrid(ctx, length, 2*altitude, patternAngle, function(x,y) {
      
        // Move the origin to the center plus offset of our desired pattern
        var xOffset=height*Math.cos(angle);
        var yOffset=height*Math.sin(angle);
        ctx.translate(x-xOffset,y+yOffset);
              
        for (var i=0; i<2; i++) {
          for (var j=0; j<3; j++) {
            Mask.triangle5(ctx,length,height);
            ctx.rotate(2*Math.PI/3);
          }
          ctx.rotate(Math.PI);
          ctx.scale(-1,1);
          ctx.translate(2*xOffset,2*yOffset);
        }
        
        // Recenter our current position
        ctx.translate(-(x+3*xOffset),-(y+yOffset)); 
  
      });
    },
    
    // Group 16
    p6 : function(ctx, length, patternAngle) {
    patternAngle = typeof patternAngle !== 'undefined' ? patternAngle : 0;	  
      
      var angle=Math.PI/6;
      var altitude=Math.sqrt(3)*length/2;
      var height=altitude-Math.sqrt(3)/3*length;
    
      rhombicGrid(ctx, length, 2*altitude, patternAngle, function(x,y) {
      
        var xOffset=height*Math.cos(angle);
        var yOffset=height*Math.sin(angle);
        ctx.translate(x-xOffset,y+yOffset);
              
        for (var i=0; i<2; i++) {
          for (var j=0; j<3; j++) {
            Mask.triangle5(ctx,length,height);
            ctx.rotate(2*Math.PI/3);
          }
          ctx.rotate(Math.PI);
          ctx.translate(-2*xOffset,2*yOffset);
        }
        
        // Recenter our current position
        ctx.translate(-(x-xOffset),-(y+yOffset));  
      });
    },
    
    // Group 17
    p6m : function(ctx, length, patternAngle) {
    patternAngle = typeof patternAngle !== 'undefined' ? patternAngle : 0;	  
      
      var angle=Math.PI/6;
      var altitude=Math.sqrt(3)*length/2;
      var height=altitude-Math.sqrt(3)/3*length;
    
      rhombicGrid(ctx, length, 2*altitude, patternAngle, function(x,y) {
      
        // Move the origin to the center plus offset of our desired pattern
        var xOffset=height*Math.cos(angle);
        var yOffset=height*Math.sin(angle);
        ctx.translate(x-xOffset,y+yOffset);
          
        for (var i=0; i<2; i++) {
          for (var j=0; j<6; j++) {
            Mask.triangle3(ctx,length/2,height);
            ctx.rotate(2*Math.PI/3);
            ctx.scale(-1,1);
            Mask.triangle3(ctx,length/2,height);
            ctx.scale(-1,1);
          }
          ctx.rotate(Math.PI);
          ctx.translate(-2*xOffset,2*yOffset);
        }
        
        // Recenter our current position
        ctx.translate(-(x-xOffset),-(y+yOffset));      
      });
    }    
  };
})
()