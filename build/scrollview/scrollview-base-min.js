/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.2.0
build: nightly
*/
YUI.add("scrollview-base",function(b){var f=b.ClassNameManager.getClassName,t="scrollview",s={vertical:f(t,"vert"),horizontal:f(t,"horiz")},x="scrollEnd",i="flick",a=i,h="ui",l="left",o="top",e="px",m="scrollY",n="scrollX",c="bounce",r="x",q="y",u="boundingBox",k="contentBox",w="",p="0s",g=b.UA.ie,d=b.Transition.useNative,j=function(A,z,y){return Math.min(Math.max(A,z),y);};b.Node.DOM_EVENTS.DOMSubtreeModified=true;function v(){v.superclass.constructor.apply(this,arguments);}b.ScrollView=b.extend(v,b.Widget,{initializer:function(){var y=this;y._cb=y.get(k);y._bb=y.get(u);},_uiSizeCB:function(){},_onTransEnd:function(y){this.fire(x);},bindUI:function(){var z=this,y=z._cb,D=z._bb,C=z._afterScrollChange,B=z._afterDimChange,A=z.get(a);D.on("gesturemovestart",b.bind(z._onGestureMoveStart,z));if(g){z._fixIESelect(D,y);}if(d){y.on("DOMSubtreeModified",b.bind(z._uiDimensionsChange,z));}if(A){y.on("flick",b.bind(z._flick,z),A);}this.after({"scrollYChange":C,"scrollXChange":C,"heightChange":B,"widthChange":B});},syncUI:function(){this._uiDimensionsChange();this.scrollTo(this.get(n),this.get(m));},scrollTo:function(J,I,D,G){var C=this._cb,E=(J!==null),B=(I!==null),A=(E)?J*-1:0,z=(B)?I*-1:0,F,H=v._TRANSITION,K=this._transEndCB;D=D||0;G=G||v.EASING;if(E){this.set(n,J,{src:h});}if(B){this.set(m,I,{src:h});}if(d){C.setStyle(H.DURATION,p).setStyle(H.PROPERTY,w);}if(D!==0){F={easing:G,duration:D/1000};if(d){F.transform="translate3D("+A+"px,"+z+"px, 0px)";}else{if(E){F.left=A+e;}if(B){F.top=z+e;}}if(!K){K=this._transEndCB=b.bind(this._onTransEnd,this);}C.transition(F,K);}else{if(d){C.setStyle("transform","translate3D("+A+"px,"+z+"px, 0px)");}else{if(E){C.setStyle(l,A+e);}if(B){C.setStyle(o,z+e);}}}},_prevent:{start:false,move:true,end:false},_onGestureMoveStart:function(z){var y=this,A=y._bb;if(y._prevent.start){z.preventDefault();}y._killTimer();y._hm=A.on("gesturemove",b.bind(y._onGestureMove,y));y._hme=A.on("gesturemoveend",b.bind(y._onGestureMoveEnd,y));y._startY=z.clientY+y.get(m);y._startX=z.clientX+y.get(n);y._startClientY=y._endClientY=z.clientY;y._startClientX=y._endClientX=z.clientX;y._isDragging=false;y._flicking=false;y._snapToEdge=false;},_onGestureMove:function(z){var y=this;if(y._prevent.move){z.preventDefault();}y._isDragging=true;y._endClientY=z.clientY;y._endClientX=z.clientX;if(y._scrollsVertical){y.set(m,-(z.clientY-y._startY));}if(y._scrollsHorizontal){y.set(n,-(z.clientX-y._startX));}},_onGestureMoveEnd:function(H){if(this._prevent.end){H.preventDefault();}var O=this,D=O._minScrollY,z=O._maxScrollY,E=O._minScrollX,B=O._maxScrollX,G=O._scrollsVertical,P=O._scrollsHorizontal,C=G?O._startClientY:O._startClientX,M=G?O._endClientY:O._endClientX,A=C-M,F=Math.abs(A),J=O._bb,N,L,K,I;O._hm.detach();O._hme.detach();O._scrolledHalfway=O._snapToEdge=O._isDragging=false;O.lastScrolledAmt=A;if((P&&F>J.get("offsetWidth")/2)||(G&&F>J.get("offsetHeight")/2)){O._scrolledHalfway=true;O._scrolledForward=A>0;}if(G){I=O.get(m);L=j(I,D,z);}if(P){K=O.get(n);N=j(K,E,B);}if(N!==K||L!==I){this._snapToEdge=true;if(G){O.set(m,L);}if(P){O.set(n,N);}}if(O._snapToEdge){return;}O.fire(x,{onGestureMoveEnd:true});return;},_afterScrollChange:function(z){var y=z.duration,B=z.easing,A=z.newVal;if(z.src!==h){if(z.attrName==n){this._uiScrollTo(A,null,y,B);}else{this._uiScrollTo(null,A,y,B);}}},_uiScrollTo:function(z,C,A,B){A=A||this._snapToEdge?400:0;B=B||this._snapToEdge?v.SNAP_EASING:null;this.scrollTo(z,C,A,B);},_afterDimChange:function(){this._uiDimensionsChange();},_uiDimensionsChange:function(){var z=this,E=z._bb,D=v.CLASS_NAMES,y=z.get("height"),C=z.get("width"),B=E.get("scrollHeight"),A=E.get("scrollWidth");if(y&&B>y){z._scrollsVertical=true;z._maxScrollY=B-y;z._minScrollY=0;z._scrollHeight=B;E.addClass(D.vertical);}if(C&&A>C){z._scrollsHorizontal=true;z._maxScrollX=A-C;z._minScrollX=0;z._scrollWidth=A;E.addClass(D.horizontal);}},_flick:function(A){var z=A.flick,y=this;y._currentVelocity=z.velocity;y._flicking=true;y._cDecel=y.get("deceleration");y._cBounce=y.get("bounce");y._pastYEdge=false;y._pastXEdge=false;y._flickFrame();y.fire(i);},_flickFrame:function(){var H=this,K,z,C,y,A,D,I=H._scrollsVertical,F=H._scrollsHorizontal,E=H._cDecel,J=H._cBounce,G=H._currentVelocity,B=v.FRAME_STEP;if(I){z=H._maxScrollY;C=H._minScrollY;K=H.get(m)-(G*B);}if(F){A=H._maxScrollX;D=H._minScrollX;y=H.get(n)-(G*B);}G=H._currentVelocity=(G*E);if(Math.abs(G).toFixed(4)<=0.015){H._flicking=false;H._killTimer(!(H._pastYEdge||H._pastXEdge));if(I){if(K<C){H._snapToEdge=true;H.set(m,C);}else{if(K>z){H._snapToEdge=true;H.set(m,z);}}}if(F){if(y<D){H._snapToEdge=true;H.set(n,D);}else{if(y>A){H._snapToEdge=true;H.set(n,A);}}}return;}if(I){if(K<C||K>z){H._pastYEdge=true;H._currentVelocity*=J;}H.set(m,K);}if(F){if(y<D||y>A){H._pastXEdge=true;H._currentVelocity*=J;}H.set(n,y);}if(!H._flickTimer){H._flickTimer=b.later(B,H,"_flickFrame",null,true);}},_killTimer:function(z){var y=this;if(y._flickTimer){y._flickTimer.cancel();y._flickTimer=null;}if(z){y.fire(x);}},_setScroll:function(E,D){var A=this._cachedBounce||this.get(c),z=v.BOUNCE_RANGE,C=(D==r)?this._maxScrollX:this._maxScrollY,B=A?-z:0,y=A?C+z:C;if(!A||!this._isDragging){if(E<B){E=B;}else{if(E>y){E=y;}}}return E;},_setScrollX:function(y){return this._setScroll(y,r);},_setScrollY:function(y){return this._setScroll(y,q);}},{NAME:"scrollview",ATTRS:{scrollY:{value:0,setter:"_setScrollY"},scrollX:{value:0,setter:"_setScrollX"},deceleration:{value:0.93},bounce:{value:0.1},flick:{value:{minDistance:10,minVelocity:0.3}}},CLASS_NAMES:s,UI_SRC:h,BOUNCE_RANGE:150,FRAME_STEP:30,EASING:"cubic-bezier(0, 0.1, 0, 1.0)",SNAP_EASING:"ease-out",_TRANSITION:{DURATION:"WebkitTransitionDuration",PROPERTY:"WebkitTransitionProperty"}});},"3.2.0",{skinnable:true,requires:["widget","event-gestures","transition"]});