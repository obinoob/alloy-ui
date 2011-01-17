/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.2.0
build: nightly
*/
YUI.add("dd-ddm-base",function(b){var a=function(){a.superclass.constructor.apply(this,arguments);};a.NAME="ddm";a.ATTRS={dragCursor:{value:"move"},clickPixelThresh:{value:3},clickTimeThresh:{value:1000},throttleTime:{value:-1},dragMode:{value:"point",setter:function(c){this._setDragMode(c);return c;}}};b.extend(a,b.Base,{_createPG:function(){},_active:null,_setDragMode:function(c){if(c===null){c=b.DD.DDM.get("dragMode");}switch(c){case 1:case"intersect":return 1;case 2:case"strict":return 2;case 0:case"point":return 0;}return 0;},CSS_PREFIX:b.ClassNameManager.getClassName("dd"),_activateTargets:function(){},_drags:[],activeDrag:false,_regDrag:function(c){if(this.getDrag(c.get("node"))){return false;}if(!this._active){this._setupListeners();}this._drags.push(c);return true;},_unregDrag:function(e){var c=[];b.each(this._drags,function(f,d){if(f!==e){c[c.length]=f;}});this._drags=c;},_setupListeners:function(){this._createPG();this._active=true;var c=b.one(b.config.doc);c.on("mousemove",b.throttle(b.bind(this._move,this),this.get("throttleTime")));c.on("mouseup",b.bind(this._end,this));},_start:function(){this.fire("ddm:start");this._startDrag();},_startDrag:function(){},_endDrag:function(){},_dropMove:function(){},_end:function(){if(this.activeDrag){this._endDrag();this.fire("ddm:end");this.activeDrag.end.call(this.activeDrag);this.activeDrag=null;}},stopDrag:function(){if(this.activeDrag){this._end();}return this;},_move:function(c){if(this.activeDrag){this.activeDrag._move.call(this.activeDrag,c);this._dropMove();}},cssSizestoObject:function(d){var c=d.split(" ");switch(c.length){case 1:c[1]=c[2]=c[3]=c[0];break;case 2:c[2]=c[0];c[3]=c[1];break;case 3:c[3]=c[1];break;}return{top:parseInt(c[0],10),right:parseInt(c[1],10),bottom:parseInt(c[2],10),left:parseInt(c[3],10)};},getDrag:function(d){var c=false,e=b.one(d);if(e instanceof b.Node){b.each(this._drags,function(g,f){if(e.compareTo(g.get("node"))){c=g;}});}return c;},swapPosition:function(d,c){d=b.DD.DDM.getNode(d);c=b.DD.DDM.getNode(c);var f=d.getXY(),e=c.getXY();d.setXY(e);c.setXY(f);return d;},getNode:function(c){if(c&&c.get){if(b.Widget&&(c instanceof b.Widget)){c=c.get("boundingBox");}else{c=c.get("node");}}else{c=b.one(c);}return c;},swapNode:function(e,c){e=b.DD.DDM.getNode(e);c=b.DD.DDM.getNode(c);var f=c.get("parentNode"),d=c.get("nextSibling");if(d==e){f.insertBefore(e,c);}else{if(c==e.get("nextSibling")){f.insertBefore(c,e);}else{e.get("parentNode").replaceChild(c,e);f.insertBefore(e,d);}}return e;}});b.namespace("DD");b.DD.DDM=new a();},"3.2.0",{requires:["node","base","yui-throttle","classnamemanager"],skinnable:false});YUI.add("dd-ddm",function(a){a.mix(a.DD.DDM,{_pg:null,_debugShim:false,_activateTargets:function(){},_deactivateTargets:function(){},_startDrag:function(){if(this.activeDrag&&this.activeDrag.get("useShim")){this._pg_activate();this._activateTargets();}},_endDrag:function(){this._pg_deactivate();this._deactivateTargets();},_pg_deactivate:function(){this._pg.setStyle("display","none");},_pg_activate:function(){var b=this.activeDrag.get("activeHandle"),c="auto";if(b){c=b.getStyle("cursor");}if(c=="auto"){c=this.get("dragCursor");}this._pg_size();this._pg.setStyles({top:0,left:0,display:"block",opacity:((this._debugShim)?".5":"0"),cursor:c});},_pg_size:function(){if(this.activeDrag){var c=a.one("body"),e=c.get("docHeight"),d=c.get("docWidth");this._pg.setStyles({height:e+"px",width:d+"px"});}},_createPG:function(){var d=a.Node.create("<div></div>"),b=a.one("body"),c;d.setStyles({top:"0",left:"0",position:"absolute",zIndex:"9999",overflow:"hidden",backgroundColor:"red",display:"none",height:"5px",width:"5px"});d.set("id",a.stamp(d));d.addClass(a.DD.DDM.CSS_PREFIX+"-shim");b.prepend(d);this._pg=d;this._pg.on("mousemove",a.throttle(a.bind(this._move,this),this.get("throttleTime")));this._pg.on("mouseup",a.bind(this._end,this));c=a.one("win");a.on("window:resize",a.bind(this._pg_size,this));c.on("scroll",a.bind(this._pg_size,this));}},true);},"3.2.0",{requires:["dd-ddm-base","event-resize"],skinnable:false});YUI.add("dd-ddm-drop",function(a){a.mix(a.DD.DDM,{_noShim:false,_activeShims:[],_hasActiveShim:function(){if(this._noShim){return true;}return this._activeShims.length;},_addActiveShim:function(b){this._activeShims[this._activeShims.length]=b;},_removeActiveShim:function(c){var b=[];a.each(this._activeShims,function(e,d){if(e._yuid!==c._yuid){b[b.length]=e;}});this._activeShims=b;},syncActiveShims:function(b){a.later(0,this,function(c){var d=((c)?this.targets:this._lookup());a.each(d,function(f,e){f.sizeShim.call(f);},this);},b);},mode:0,POINT:0,INTERSECT:1,STRICT:2,useHash:true,activeDrop:null,validDrops:[],otherDrops:{},targets:[],_addValid:function(b){this.validDrops[this.validDrops.length]=b;return this;},_removeValid:function(b){var c=[];a.each(this.validDrops,function(e,d){if(e!==b){c[c.length]=e;}});this.validDrops=c;return this;},isOverTarget:function(c){if(this.activeDrag&&c){var g=this.activeDrag.mouseXY,f,b=this.activeDrag.get("dragMode"),e,d=c.shim;if(g&&this.activeDrag){e=this.activeDrag.region;if(b==this.STRICT){return this.activeDrag.get("dragNode").inRegion(c.region,true,e);}else{if(c&&c.shim){if((b==this.INTERSECT)&&this._noShim){f=((e)?e:this.activeDrag.get("node"));return c.get("node").intersect(f,c.region).inRegion;}else{if(this._noShim){d=c.get("node");}return d.intersect({top:g[1],bottom:g[1],left:g[0],right:g[0]},c.region).inRegion;}}else{return false;}}}else{return false;}}else{return false;}},clearCache:function(){this.validDrops=[];this.otherDrops={};this._activeShims=[];},_activateTargets:function(){this._noShim=true;this.clearCache();a.each(this.targets,function(c,b){c._activateShim([]);if(c.get("noShim")==true){this._noShim=false;}},this);this._handleTargetOver();},getBestMatch:function(f,d){var c=null,e=0,b;a.each(f,function(i,h){var g=this.activeDrag.get("dragNode").intersect(i.get("node"));i.region.area=g.area;if(g.inRegion){if(g.area>e){e=g.area;c=i;}}},this);if(d){b=[];a.each(f,function(h,g){if(h!==c){b[b.length]=h;
}},this);return[c,b];}else{return c;}},_deactivateTargets:function(){var b=[],c,e=this.activeDrag,d=this.activeDrop;if(e&&d&&this.otherDrops[d]){if(!e.get("dragMode")){b=this.otherDrops;delete b[d];}else{c=this.getBestMatch(this.otherDrops,true);d=c[0];b=c[1];}e.get("node").removeClass(this.CSS_PREFIX+"-drag-over");if(d){d.fire("drop:hit",{drag:e,drop:d,others:b});e.fire("drag:drophit",{drag:e,drop:d,others:b});}}else{if(e&&e.get("dragging")){e.get("node").removeClass(this.CSS_PREFIX+"-drag-over");e.fire("drag:dropmiss",{pageX:e.lastXY[0],pageY:e.lastXY[1]});}else{}}this.activeDrop=null;a.each(this.targets,function(g,f){g._deactivateShim([]);},this);},_dropMove:function(){if(this._hasActiveShim()){this._handleTargetOver();}else{a.each(this.otherDrops,function(c,b){c._handleOut.apply(c,[]);});}},_lookup:function(){if(!this.useHash||this._noShim){return this.validDrops;}var b=[];a.each(this.validDrops,function(d,c){if(d.shim&&d.shim.inViewportRegion(false,d.region)){b[b.length]=d;}});return b;},_handleTargetOver:function(){var b=this._lookup();a.each(b,function(d,c){d._handleTargetOver.call(d);},this);},_regTarget:function(b){this.targets[this.targets.length]=b;},_unregTarget:function(c){var b=[],d;a.each(this.targets,function(f,e){if(f!=c){b[b.length]=f;}},this);this.targets=b;d=[];a.each(this.validDrops,function(f,e){if(f!==c){d[d.length]=f;}});this.validDrops=d;},getDrop:function(c){var b=false,d=a.one(c);if(d instanceof a.Node){a.each(this.targets,function(f,e){if(d.compareTo(f.get("node"))){b=f;}});}return b;}},true);},"3.2.0",{requires:["dd-ddm"],skinnable:false});YUI.add("dd-drag",function(d){var e=d.DD.DDM,r="node",g="dragging",m="dragNode",c="offsetHeight",k="offsetWidth",h="drag:mouseDown",b="drag:afterMouseDown",f="drag:removeHandle",l="drag:addHandle",p="drag:removeInvalid",q="drag:addInvalid",j="drag:start",i="drag:end",n="drag:drag",o="drag:align",a=function(t){this._lazyAddAttrs=false;a.superclass.constructor.apply(this,arguments);var s=e._regDrag(this);if(!s){d.error("Failed to register node, already in use: "+t.node);}};a.NAME="drag";a.START_EVENT="mousedown";a.ATTRS={node:{setter:function(s){var t=d.one(s);if(!t){d.error("DD.Drag: Invalid Node Given: "+s);}else{t=t.item(0);}return t;}},dragNode:{setter:function(s){var t=d.one(s);if(!t){d.error("DD.Drag: Invalid dragNode Given: "+s);}return t;}},offsetNode:{value:true},startCentered:{value:false},clickPixelThresh:{value:e.get("clickPixelThresh")},clickTimeThresh:{value:e.get("clickTimeThresh")},lock:{value:false,setter:function(s){if(s){this.get(r).addClass(e.CSS_PREFIX+"-locked");}else{this.get(r).removeClass(e.CSS_PREFIX+"-locked");}return s;}},data:{value:false},move:{value:true},useShim:{value:true},activeHandle:{value:false},primaryButtonOnly:{value:true},dragging:{value:false},parent:{value:false},target:{value:false,setter:function(s){this._handleTarget(s);return s;}},dragMode:{value:null,setter:function(s){return e._setDragMode(s);}},groups:{value:["default"],getter:function(){if(!this._groups){this._groups={};}var s=[];d.each(this._groups,function(u,t){s[s.length]=t;});return s;},setter:function(s){this._groups={};d.each(s,function(u,t){this._groups[u]=true;},this);return s;}},handles:{value:null,setter:function(s){if(s){this._handles={};d.each(s,function(u,t){var w=u;if(u instanceof d.Node||u instanceof d.NodeList){w=u._yuid;}this._handles[w]=u;},this);}else{this._handles=null;}return s;}},bubbles:{setter:function(s){this.addTarget(s);return s;}},haltDown:{value:true}};d.extend(a,d.Base,{_bubbleTargets:d.DD.DDM,addToGroup:function(s){this._groups[s]=true;e._activateTargets();return this;},removeFromGroup:function(s){delete this._groups[s];e._activateTargets();return this;},target:null,_handleTarget:function(s){if(d.DD.Drop){if(s===false){if(this.target){e._unregTarget(this.target);this.target=null;}return false;}else{if(!d.Lang.isObject(s)){s={};}s.bubbleTargets=("bubbleTargets" in s)?s.bubbleTargets:d.Object.values(this._yuievt.targets);s.node=this.get(r);s.groups=s.groups||this.get("groups");this.target=new d.DD.Drop(s);}}else{return false;}},_groups:null,_createEvents:function(){this.publish(h,{defaultFn:this._defMouseDownFn,queuable:false,emitFacade:true,bubbles:true,prefix:"drag"});this.publish(o,{defaultFn:this._defAlignFn,queuable:false,emitFacade:true,bubbles:true,prefix:"drag"});this.publish(n,{defaultFn:this._defDragFn,queuable:false,emitFacade:true,bubbles:true,prefix:"drag"});this.publish(i,{defaultFn:this._defEndFn,preventedFn:this._prevEndFn,queuable:false,emitFacade:true,bubbles:true,prefix:"drag"});var s=[b,f,l,p,q,j,"drag:drophit","drag:dropmiss","drag:over","drag:enter","drag:exit"];d.each(s,function(u,t){this.publish(u,{type:u,emitFacade:true,bubbles:true,preventable:false,queuable:false,prefix:"drag"});},this);},_ev_md:null,_startTime:null,_endTime:null,_handles:null,_invalids:null,_invalidsDefault:{"textarea":true,"input":true,"a":true,"button":true,"select":true},_dragThreshMet:null,_fromTimeout:null,_clickTimeout:null,deltaXY:null,startXY:null,nodeXY:null,lastXY:null,actXY:null,realXY:null,mouseXY:null,region:null,_handleMouseUp:function(s){this._fixIEMouseUp();if(e.activeDrag){e._end();}},_fixDragStart:function(s){s.preventDefault();},_ieSelectFix:function(){return false;},_ieSelectBack:null,_fixIEMouseDown:function(){if(d.UA.ie){this._ieSelectBack=d.config.doc.body.onselectstart;d.config.doc.body.onselectstart=this._ieSelectFix;}},_fixIEMouseUp:function(){if(d.UA.ie){d.config.doc.body.onselectstart=this._ieSelectBack;}},_handleMouseDownEvent:function(s){this.fire(h,{ev:s});},_defMouseDownFn:function(t){var s=t.ev;this._dragThreshMet=false;this._ev_md=s;if(this.get("primaryButtonOnly")&&s.button>1){return false;}if(this.validClick(s)){this._fixIEMouseDown();if(this.get("haltDown")){s.halt();}else{s.preventDefault();}this._setStartPosition([s.pageX,s.pageY]);e.activeDrag=this;this._clickTimeout=d.later(this.get("clickTimeThresh"),this,this._timeoutCheck);}this.fire(b,{ev:s});},validClick:function(w){var v=false,z=false,s=w.target,u=null,t=null,x=null,y=false;
if(this._handles){d.each(this._handles,function(A,B){if(A instanceof d.Node||A instanceof d.NodeList){if(!v){x=A;if(x instanceof d.Node){x=new d.NodeList(A._node);}x.each(function(C){if(C.contains(s)){v=true;}});}}else{if(d.Lang.isString(B)){if(s.test(B+", "+B+" *")&&!u){u=B;v=true;}}}});}else{z=this.get(r);if(z.contains(s)||z.compareTo(s)){v=true;}}if(v){if(this._invalids){d.each(this._invalids,function(A,B){if(d.Lang.isString(B)){if(s.test(B+", "+B+" *")){v=false;}}});}}if(v){if(u){t=w.currentTarget.all(u);y=false;t.each(function(B,A){if((B.contains(s)||B.compareTo(s))&&!y){y=true;this.set("activeHandle",B);}},this);}else{this.set("activeHandle",this.get(r));}}return v;},_setStartPosition:function(s){this.startXY=s;this.nodeXY=this.lastXY=this.realXY=this.get(r).getXY();if(this.get("offsetNode")){this.deltaXY=[(this.startXY[0]-this.nodeXY[0]),(this.startXY[1]-this.nodeXY[1])];}else{this.deltaXY=[0,0];}},_timeoutCheck:function(){if(!this.get("lock")&&!this._dragThreshMet&&this._ev_md){this._fromTimeout=this._dragThreshMet=true;this.start();this._alignNode([this._ev_md.pageX,this._ev_md.pageY],true);}},removeHandle:function(t){var s=t;if(t instanceof d.Node||t instanceof d.NodeList){s=t._yuid;}if(this._handles[s]){delete this._handles[s];this.fire(f,{handle:t});}return this;},addHandle:function(t){if(!this._handles){this._handles={};}var s=t;if(t instanceof d.Node||t instanceof d.NodeList){s=t._yuid;}this._handles[s]=t;this.fire(l,{handle:t});return this;},removeInvalid:function(s){if(this._invalids[s]){this._invalids[s]=null;delete this._invalids[s];this.fire(p,{handle:s});}return this;},addInvalid:function(s){if(d.Lang.isString(s)){this._invalids[s]=true;this.fire(q,{handle:s});}return this;},initializer:function(s){this.get(r).dd=this;if(!this.get(r).get("id")){var t=d.stamp(this.get(r));this.get(r).set("id",t);}this.actXY=[];this._invalids=d.clone(this._invalidsDefault,true);this._createEvents();if(!this.get(m)){this.set(m,this.get(r));}this.on("initializedChange",d.bind(this._prep,this));this.set("groups",this.get("groups"));},_prep:function(){this._dragThreshMet=false;var s=this.get(r);s.addClass(e.CSS_PREFIX+"-draggable");s.addClass(e.CSS_PREFIX+"-draggable");s.on(a.START_EVENT,d.bind(this._handleMouseDownEvent,this));s.on("mouseup",d.bind(this._handleMouseUp,this));s.on("dragstart",d.bind(this._fixDragStart,this));},_unprep:function(){var s=this.get(r);s.removeClass(e.CSS_PREFIX+"-draggable");s.detachAll();},start:function(){if(!this.get("lock")&&!this.get(g)){var t=this.get(r),s,u,v;this._startTime=(new Date()).getTime();e._start();t.addClass(e.CSS_PREFIX+"-dragging");this.fire(j,{pageX:this.nodeXY[0],pageY:this.nodeXY[1],startTime:this._startTime});t=this.get(m);v=this.nodeXY;s=t.get(k);u=t.get(c);if(this.get("startCentered")){this._setStartPosition([v[0]+(s/2),v[1]+(u/2)]);}this.region={"0":v[0],"1":v[1],area:0,top:v[1],right:v[0]+s,bottom:v[1]+u,left:v[0]};this.set(g,true);}return this;},end:function(){this._endTime=(new Date()).getTime();if(this._clickTimeout){this._clickTimeout.cancel();}this._dragThreshMet=this._fromTimeout=false;this._ev_md=null;if(!this.get("lock")&&this.get(g)){this.fire(i,{pageX:this.lastXY[0],pageY:this.lastXY[1],startTime:this._startTime,endTime:this._endTime});}this.get(r).removeClass(e.CSS_PREFIX+"-dragging");this.set(g,false);this.deltaXY=[0,0];return this;},_defEndFn:function(s){this._fixIEMouseUp();},_prevEndFn:function(s){this._fixIEMouseUp();this.get(m).setXY(this.nodeXY);},_align:function(s){this.fire(o,{pageX:s[0],pageY:s[1]});},_defAlignFn:function(s){this.actXY=[s.pageX-this.deltaXY[0],s.pageY-this.deltaXY[1]];},_alignNode:function(s){this._align(s);this._moveNode();},_moveNode:function(s){var t=[],u=[],w=this.nodeXY,v=this.actXY;t[0]=(v[0]-this.lastXY[0]);t[1]=(v[1]-this.lastXY[1]);u[0]=(v[0]-this.nodeXY[0]);u[1]=(v[1]-this.nodeXY[1]);this.region={"0":v[0],"1":v[1],area:0,top:v[1],right:v[0]+this.get(m).get(k),bottom:v[1]+this.get(m).get(c),left:v[0]};this.fire(n,{pageX:v[0],pageY:v[1],scroll:s,info:{start:w,xy:v,delta:t,offset:u}});this.lastXY=v;},_defDragFn:function(s){if(this.get("move")){if(s.scroll){s.scroll.node.set("scrollTop",s.scroll.top);s.scroll.node.set("scrollLeft",s.scroll.left);}this.get(m).setXY([s.pageX,s.pageY]);this.realXY=[s.pageX,s.pageY];}},_move:function(u){if(this.get("lock")){return false;}else{this.mouseXY=[u.pageX,u.pageY];if(!this._dragThreshMet){var t=Math.abs(this.startXY[0]-u.pageX),s=Math.abs(this.startXY[1]-u.pageY);if(t>this.get("clickPixelThresh")||s>this.get("clickPixelThresh")){this._dragThreshMet=true;this.start();this._alignNode([u.pageX,u.pageY]);}}else{if(this._clickTimeout){this._clickTimeout.cancel();}this._alignNode([u.pageX,u.pageY]);}}},stopDrag:function(){if(this.get(g)){e._end();}return this;},destructor:function(){this._unprep();this.detachAll();if(this.target){this.target.destroy();}e._unregDrag(this);}});d.namespace("DD");d.DD.Drag=a;},"3.2.0",{requires:["dd-ddm-base"],skinnable:false});YUI.add("dd-proxy",function(h){var f=h.DD.DDM,b="node",c="dragNode",a="host",d=true,e,g=function(i){g.superclass.constructor.apply(this,arguments);};g.NAME="DDProxy";g.NS="proxy";g.ATTRS={host:{},moveOnEnd:{value:d},hideOnEnd:{value:d},resizeFrame:{value:d},positionProxy:{value:d},borderStyle:{value:"1px solid #808080"},cloneNode:{value:false}};e={_hands:null,_init:function(){if(!f._proxy){f._createFrame();h.on("domready",h.bind(this._init,this));return;}if(!this._hands){this._hands=[];}var k,j,l=this.get(a),i=l.get(c);if(i.compareTo(l.get(b))){if(f._proxy){l.set(c,f._proxy);}}h.each(this._hands,function(m){m.detach();});k=f.on("ddm:start",h.bind(function(){if(f.activeDrag===l){f._setFrame(l);}},this));j=f.on("ddm:end",h.bind(function(){if(l.get("dragging")){if(this.get("moveOnEnd")){l.get(b).setXY(l.lastXY);}if(this.get("hideOnEnd")){l.get(c).setStyle("display","none");}if(this.get("cloneNode")){l.get(c).remove();l.set(c,f._proxy);}}},this));this._hands=[k,j];},initializer:function(){this._init();},destructor:function(){var i=this.get(a);
h.each(this._hands,function(j){j.detach();});i.set(c,i.get(b));},clone:function(){var i=this.get(a),k=i.get(b),j=k.cloneNode(true);delete j._yuid;j.setAttribute("id",h.guid());j.setStyle("position","absolute");k.get("parentNode").appendChild(j);i.set(c,j);return j;}};h.namespace("Plugin");h.extend(g,h.Base,e);h.Plugin.DDProxy=g;h.mix(f,{_createFrame:function(){if(!f._proxy){f._proxy=d;var j=h.Node.create("<div></div>"),i=h.one("body");j.setStyles({position:"absolute",display:"none",zIndex:"999",top:"-999px",left:"-999px"});i.prepend(j);j.set("id",h.guid());j.addClass(f.CSS_PREFIX+"-proxy");f._proxy=j;}},_setFrame:function(j){var m=j.get(b),l=j.get(c),i,k="auto";i=f.activeDrag.get("activeHandle");if(i){k=i.getStyle("cursor");}if(k=="auto"){k=f.get("dragCursor");}l.setStyles({visibility:"hidden",display:"block",cursor:k,border:j.proxy.get("borderStyle")});if(j.proxy.get("cloneNode")){l=j.proxy.clone();}if(j.proxy.get("resizeFrame")){l.setStyles({height:m.get("offsetHeight")+"px",width:m.get("offsetWidth")+"px"});}if(j.proxy.get("positionProxy")){l.setXY(j.nodeXY);}l.setStyle("visibility","visible");}});},"3.2.0",{requires:["dd-ddm","dd-drag"],skinnable:false});YUI.add("dd-constrain",function(b){var l="dragNode",n="offsetHeight",e="offsetWidth",q="host",f="tickXArray",o="tickYArray",p=b.DD.DDM,d="top",j="right",m="bottom",c="left",k="view",h=null,i="drag:tickAlignX",g="drag:tickAlignY",a=function(r){this._lazyAddAttrs=false;a.superclass.constructor.apply(this,arguments);};a.NAME="ddConstrained";a.NS="con";a.ATTRS={host:{},stickX:{value:false},stickY:{value:false},tickX:{value:false},tickY:{value:false},tickXArray:{value:false},tickYArray:{value:false},gutter:{value:"0",setter:function(r){return b.DD.DDM.cssSizestoObject(r);}},constrain:{value:k,setter:function(r){var s=b.one(r);if(s){r=s;}return r;}},constrain2region:{setter:function(s){return this.set("constrain",s);}},constrain2node:{setter:function(r){return this.set("constrain",b.one(r));}},constrain2view:{setter:function(r){return this.set("constrain",k);}},cacheRegion:{value:true}};h={_lastTickXFired:null,_lastTickYFired:null,initializer:function(){this._createEvents();this.get(q).on("drag:start",b.bind(this._handleStart,this));this.get(q).after("drag:align",b.bind(this.align,this));this.get(q).after("drag:drag",b.bind(this.drag,this));},_createEvents:function(){var r=this;var s=[i,g];b.each(s,function(u,t){this.publish(u,{type:u,emitFacade:true,bubbles:true,queuable:false,prefix:"drag"});},this);},_handleStart:function(){this.resetCache();},_regionCache:null,_cacheRegion:function(){this._regionCache=this.get("constrain").get("region");},resetCache:function(){this._regionCache=null;},_getConstraint:function(){var r=this.get("constrain"),s=this.get("gutter"),t;if(r){if(r instanceof b.Node){if(!this._regionCache){b.on("resize",b.bind(this._cacheRegion,this),b.config.win);this._cacheRegion();}t=b.clone(this._regionCache);if(!this.get("cacheRegion")){this.resetCache();}}else{if(b.Lang.isObject(r)){t=b.clone(r);}}}if(!r||!t){r=k;}if(r===k){t=this.get(q).get(l).get("viewportRegion");}b.each(s,function(u,v){if((v==j)||(v==m)){t[v]-=u;}else{t[v]+=u;}});return t;},getRegion:function(w){var u={},v=null,s=null,t=this.get(q);u=this._getConstraint();if(w){v=t.get(l).get(n);s=t.get(l).get(e);u[j]=u[j]-s;u[m]=u[m]-v;}return u;},_checkRegion:function(s){var u=s,w=this.getRegion(),v=this.get(q),x=v.get(l).get(n),t=v.get(l).get(e);if(u[1]>(w[m]-x)){s[1]=(w[m]-x);}if(w[d]>u[1]){s[1]=w[d];}if(u[0]>(w[j]-t)){s[0]=(w[j]-t);}if(w[c]>u[0]){s[0]=w[c];}return s;},inRegion:function(t){t=t||this.get(q).get(l).getXY();var s=this._checkRegion([t[0],t[1]]),r=false;if((t[0]===s[0])&&(t[1]===s[1])){r=true;}return r;},align:function(){var u=this.get(q),s=[u.actXY[0],u.actXY[1]],t=this.getRegion(true);if(this.get("stickX")){s[1]=(u.startXY[1]-u.deltaXY[1]);}if(this.get("stickY")){s[0]=(u.startXY[0]-u.deltaXY[0]);}if(t){s=this._checkRegion(s);}s=this._checkTicks(s,t);u.actXY=s;},drag:function(v){var u=this.get(q),s=this.get("tickX"),t=this.get("tickY"),r=[u.actXY[0],u.actXY[1]];if((b.Lang.isNumber(s)||this.get(f))&&(this._lastTickXFired!==r[0])){this._tickAlignX();this._lastTickXFired=r[0];}if((b.Lang.isNumber(t)||this.get(o))&&(this._lastTickYFired!==r[1])){this._tickAlignY();this._lastTickYFired=r[1];}},_checkTicks:function(y,w){var v=this.get(q),x=(v.startXY[0]-v.deltaXY[0]),u=(v.startXY[1]-v.deltaXY[1]),s=this.get("tickX"),t=this.get("tickY");if(s&&!this.get(f)){y[0]=p._calcTicks(y[0],x,s,w[c],w[j]);}if(t&&!this.get(o)){y[1]=p._calcTicks(y[1],u,t,w[d],w[m]);}if(this.get(f)){y[0]=p._calcTickArray(y[0],this.get(f),w[c],w[j]);}if(this.get(o)){y[1]=p._calcTickArray(y[1],this.get(o),w[d],w[m]);}return y;},_tickAlignX:function(){this.fire(i);},_tickAlignY:function(){this.fire(g);}};b.namespace("Plugin");b.extend(a,b.Base,h);b.Plugin.DDConstrained=a;b.mix(p,{_calcTicks:function(y,x,u,w,v){var s=((y-x)/u),t=Math.floor(s),r=Math.ceil(s);if((t!==0)||(r!==0)){if((s>=t)&&(s<=r)){y=(x+(u*t));if(w&&v){if(y<w){y=(x+(u*(t+1)));}if(y>v){y=(x+(u*(t-1)));}}}}return y;},_calcTickArray:function(z,A,y,v){var s=0,w=A.length,u=0,t,r,x;if(!A||(A.length===0)){return z;}else{if(A[0]>=z){return A[0];}else{for(s=0;s<w;s++){u=(s+1);if(A[u]&&A[u]>=z){t=z-A[s];r=A[u]-z;x=(r>t)?A[s]:A[u];if(y&&v){if(x>v){if(A[s]){x=A[s];}else{x=A[w-1];}}}return x;}}return A[A.length-1];}}}});},"3.2.0",{requires:["dd-drag"],skinnable:false});YUI.add("dd-scroll",function(b){var h=function(){h.superclass.constructor.apply(this,arguments);},c,d,l="host",a="buffer",j="parentScroll",g="windowScroll",i="scrollTop",f="scrollLeft",e="offsetWidth",k="offsetHeight";h.ATTRS={parentScroll:{value:false,setter:function(m){if(m){return m;}return false;}},buffer:{value:30,validator:b.Lang.isNumber},scrollDelay:{value:235,validator:b.Lang.isNumber},host:{value:null},windowScroll:{value:false,validator:b.Lang.isBoolean},vertical:{value:true,validator:b.Lang.isBoolean},horizontal:{value:true,validator:b.Lang.isBoolean}};b.extend(h,b.Base,{_scrolling:null,_vpRegionCache:null,_dimCache:null,_scrollTimer:null,_getVPRegion:function(){var m={},o=this.get(j),u=this.get(a),s=this.get(g),y=((s)?[]:o.getXY()),v=((s)?"winWidth":e),q=((s)?"winHeight":k),x=((s)?o.get(i):y[1]),p=((s)?o.get(f):y[0]);
m={top:x+u,right:(o.get(v)+p)-u,bottom:(o.get(q)+x)-u,left:p+u};this._vpRegionCache=m;return m;},initializer:function(){var m=this.get(l);m.after("drag:start",b.bind(this.start,this));m.after("drag:end",b.bind(this.end,this));m.on("drag:align",b.bind(this.align,this));b.one("win").on("scroll",b.bind(function(){this._vpRegionCache=null;},this));},_checkWinScroll:function(A){var z=this._getVPRegion(),m=this.get(l),o=this.get(g),t=m.lastXY,n=false,F=this.get(a),s=this.get(j),H=s.get(i),v=s.get(f),x=this._dimCache.w,C=this._dimCache.h,u=t[1]+C,y=t[1],E=t[0]+x,q=t[0],G=y,p=q,B=H,D=v;if(this.get("horizontal")){if(q<=z.left){n=true;p=t[0]-((o)?F:0);D=v-F;}if(E>=z.right){n=true;p=t[0]+((o)?F:0);D=v+F;}}if(this.get("vertical")){if(u>=z.bottom){n=true;G=t[1]+((o)?F:0);B=H+F;}if(y<=z.top){n=true;G=t[1]-((o)?F:0);B=H-F;}}if(B<0){B=0;G=t[1];}if(D<0){D=0;p=t[0];}if(G<0){G=t[1];}if(p<0){p=t[0];}if(A){m.actXY=[p,G];m._moveNode({node:s,top:B,left:D});if(!B&&!D){this._cancelScroll();}}else{if(n){this._initScroll();}else{this._cancelScroll();}}},_initScroll:function(){this._cancelScroll();this._scrollTimer=b.Lang.later(this.get("scrollDelay"),this,this._checkWinScroll,[true],true);},_cancelScroll:function(){this._scrolling=false;if(this._scrollTimer){this._scrollTimer.cancel();delete this._scrollTimer;}},align:function(m){if(this._scrolling){this._cancelScroll();m.preventDefault();}if(!this._scrolling){this._checkWinScroll();}},_setDimCache:function(){var m=this.get(l).get("dragNode");this._dimCache={h:m.get(k),w:m.get(e)};},start:function(){this._setDimCache();},end:function(m){this._dimCache=null;this._cancelScroll();},toString:function(){return h.NAME+" #"+this.get("node").get("id");}});b.namespace("Plugin");c=function(){c.superclass.constructor.apply(this,arguments);};c.ATTRS=b.merge(h.ATTRS,{windowScroll:{value:true,setter:function(m){if(m){this.set(j,b.one("win"));}return m;}}});b.extend(c,h,{initializer:function(){this.set("windowScroll",this.get("windowScroll"));}});c.NAME=c.NS="winscroll";b.Plugin.DDWinScroll=c;d=function(){d.superclass.constructor.apply(this,arguments);};d.ATTRS=b.merge(h.ATTRS,{node:{value:false,setter:function(m){var o=b.one(m);if(!o){if(m!==false){b.error("DDNodeScroll: Invalid Node Given: "+m);}}else{o=o.item(0);this.set(j,o);}return o;}}});b.extend(d,h,{initializer:function(){this.set("node",this.get("node"));}});d.NAME=d.NS="nodescroll";b.Plugin.DDNodeScroll=d;b.DD.Scroll=h;},"3.2.0",{skinnable:false,optional:["dd-proxy"],requires:["dd-drag"]});YUI.add("dd-drop",function(a){var b="node",g=a.DD.DDM,f="offsetHeight",c="offsetWidth",i="drop:over",h="drop:enter",d="drop:exit",e=function(){this._lazyAddAttrs=false;e.superclass.constructor.apply(this,arguments);a.on("domready",a.bind(function(){a.later(100,this,this._createShim);},this));g._regTarget(this);};e.NAME="drop";e.ATTRS={node:{setter:function(j){var k=a.one(j);if(!k){a.error("DD.Drop: Invalid Node Given: "+j);}return k;}},groups:{value:["default"],setter:function(j){this._groups={};a.each(j,function(m,l){this._groups[m]=true;},this);return j;}},padding:{value:"0",setter:function(j){return g.cssSizestoObject(j);}},lock:{value:false,setter:function(j){if(j){this.get(b).addClass(g.CSS_PREFIX+"-drop-locked");}else{this.get(b).removeClass(g.CSS_PREFIX+"-drop-locked");}return j;}},bubbles:{setter:function(j){this.addTarget(j);return j;}},useShim:{value:true,setter:function(j){a.DD.DDM._noShim=!j;return j;}}};a.extend(e,a.Base,{_bubbleTargets:a.DD.DDM,addToGroup:function(j){this._groups[j]=true;return this;},removeFromGroup:function(j){delete this._groups[j];return this;},_createEvents:function(){var j=[i,h,d,"drop:hit"];a.each(j,function(m,l){this.publish(m,{type:m,emitFacade:true,preventable:false,bubbles:true,queuable:false,prefix:"drop"});},this);},_valid:null,_groups:null,shim:null,region:null,overTarget:null,inGroup:function(j){this._valid=false;var k=false;a.each(j,function(m,l){if(this._groups[m]){k=true;this._valid=true;}},this);return k;},initializer:function(j){a.later(100,this,this._createEvents);var k=this.get(b),l;if(!k.get("id")){l=a.stamp(k);k.set("id",l);}k.addClass(g.CSS_PREFIX+"-drop");this.set("groups",this.get("groups"));},destructor:function(){g._unregTarget(this);if(this.shim&&(this.shim!==this.get(b))){this.shim.detachAll();this.shim.remove();this.shim=null;}this.get(b).removeClass(g.CSS_PREFIX+"-drop");this.detachAll();},_deactivateShim:function(){if(!this.shim){return false;}this.get(b).removeClass(g.CSS_PREFIX+"-drop-active-valid");this.get(b).removeClass(g.CSS_PREFIX+"-drop-active-invalid");this.get(b).removeClass(g.CSS_PREFIX+"-drop-over");if(this.get("useShim")){this.shim.setStyles({top:"-999px",left:"-999px",zIndex:"1"});}this.overTarget=false;},_activateShim:function(){if(!g.activeDrag){return false;}if(this.get(b)===g.activeDrag.get(b)){return false;}if(this.get("lock")){return false;}var j=this.get(b);if(this.inGroup(g.activeDrag.get("groups"))){j.removeClass(g.CSS_PREFIX+"-drop-active-invalid");j.addClass(g.CSS_PREFIX+"-drop-active-valid");g._addValid(this);this.overTarget=false;if(!this.get("useShim")){this.shim=this.get(b);}this.sizeShim();}else{g._removeValid(this);j.removeClass(g.CSS_PREFIX+"-drop-active-valid");j.addClass(g.CSS_PREFIX+"-drop-active-invalid");}},sizeShim:function(){if(!g.activeDrag){return false;}if(this.get(b)===g.activeDrag.get(b)){return false;}if(this.get("lock")){return false;}if(!this.shim){a.later(100,this,this.sizeShim);return false;}var o=this.get(b),m=o.get(f),k=o.get(c),r=o.getXY(),q=this.get("padding"),j,n,l;k=k+q.left+q.right;m=m+q.top+q.bottom;r[0]=r[0]-q.left;r[1]=r[1]-q.top;if(g.activeDrag.get("dragMode")===g.INTERSECT){j=g.activeDrag;n=j.get(b).get(f);l=j.get(b).get(c);m=(m+n);k=(k+l);r[0]=r[0]-(l-j.deltaXY[0]);r[1]=r[1]-(n-j.deltaXY[1]);}if(this.get("useShim")){this.shim.setStyles({height:m+"px",width:k+"px",top:r[1]+"px",left:r[0]+"px"});}this.region={"0":r[0],"1":r[1],area:0,top:r[1],right:r[0]+k,bottom:r[1]+m,left:r[0]};},_createShim:function(){if(!g._pg){a.later(10,this,this._createShim);
return;}if(this.shim){return;}var j=this.get("node");if(this.get("useShim")){j=a.Node.create('<div id="'+this.get(b).get("id")+'_shim"></div>');j.setStyles({height:this.get(b).get(f)+"px",width:this.get(b).get(c)+"px",backgroundColor:"yellow",opacity:".5",zIndex:"1",overflow:"hidden",top:"-900px",left:"-900px",position:"absolute"});g._pg.appendChild(j);j.on("mouseover",a.bind(this._handleOverEvent,this));j.on("mouseout",a.bind(this._handleOutEvent,this));}this.shim=j;},_handleTargetOver:function(){if(g.isOverTarget(this)){this.get(b).addClass(g.CSS_PREFIX+"-drop-over");g.activeDrop=this;g.otherDrops[this]=this;if(this.overTarget){g.activeDrag.fire("drag:over",{drop:this,drag:g.activeDrag});this.fire(i,{drop:this,drag:g.activeDrag});}else{if(g.activeDrag.get("dragging")){this.overTarget=true;this.fire(h,{drop:this,drag:g.activeDrag});g.activeDrag.fire("drag:enter",{drop:this,drag:g.activeDrag});g.activeDrag.get(b).addClass(g.CSS_PREFIX+"-drag-over");}}}else{this._handleOut();}},_handleOverEvent:function(){this.shim.setStyle("zIndex","999");g._addActiveShim(this);},_handleOutEvent:function(){this.shim.setStyle("zIndex","1");g._removeActiveShim(this);},_handleOut:function(j){if(!g.isOverTarget(this)||j){if(this.overTarget){this.overTarget=false;if(!j){g._removeActiveShim(this);}if(g.activeDrag){this.get(b).removeClass(g.CSS_PREFIX+"-drop-over");g.activeDrag.get(b).removeClass(g.CSS_PREFIX+"-drag-over");this.fire(d);g.activeDrag.fire("drag:exit",{drop:this});delete g.otherDrops[this];}}}}});a.DD.Drop=e;},"3.2.0",{requires:["dd-ddm-drop","dd-drag"],skinnable:false});YUI.add("dd-delegate",function(e){var d=function(f){d.superclass.constructor.apply(this,arguments);},c="container",b="nodes",a=e.Node.create("<div>Temp Node</div>");e.extend(d,e.Base,{_bubbleTargets:e.DD.DDM,dd:null,_shimState:null,_handles:null,_onNodeChange:function(f){this.set("dragNode",f.newVal);},_afterDragEnd:function(f){e.DD.DDM._noShim=this._shimState;this.set("lastNode",this.dd.get("node"));this.get("lastNode").removeClass(e.DD.DDM.CSS_PREFIX+"-dragging");this.dd._unprep();this.dd.set("node",a);},_delMouseDown:function(h){var g=h.currentTarget,f=this.dd;if(g.test(this.get(b))&&!g.test(this.get("invalid"))){this._shimState=e.DD.DDM._noShim;e.DD.DDM._noShim=true;this.set("currentNode",g);f.set("node",g);if(f.proxy){f.set("dragNode",e.DD.DDM._proxy);}else{f.set("dragNode",g);}f._prep();f.fire("drag:mouseDown",{ev:h});}},_onMouseEnter:function(f){this._shimState=e.DD.DDM._noShim;e.DD.DDM._noShim=true;},_onMouseLeave:function(f){e.DD.DDM._noShim=this._shimState;},initializer:function(g){this._handles=[];var h=e.clone(this.get("dragConfig")||{}),f=this.get(c);h.node=a.cloneNode(true);h.bubbleTargets=this;if(this.get("handles")){h.handles=this.get("handles");}this.dd=new e.DD.Drag(h);this.dd.after("drag:end",e.bind(this._afterDragEnd,this));this.dd.on("dragNodeChange",e.bind(this._onNodeChange,this));this._handles.push(e.delegate(e.DD.Drag.START_EVENT,e.bind(this._delMouseDown,this),f,this.get(b)));this._handles.push(e.on("mouseenter",e.bind(this._onMouseEnter,this),f));this._handles.push(e.on("mouseleave",e.bind(this._onMouseLeave,this),f));e.later(50,this,this.syncTargets);e.DD.DDM.regDelegate(this);},syncTargets:function(){if(!e.Plugin.Drop||this.get("destroyed")){return;}var g,f,h;if(this.get("target")){g=e.one(this.get(c)).all(this.get(b));f=this.dd.get("groups");h=this.get("dragConfig");if(h&&"groups" in h){f=h.groups;}g.each(function(j){this.createDrop(j,f);},this);}return this;},createDrop:function(h,f){var g={useShim:false,bubbleTargets:this};if(!h.drop){h.plug(e.Plugin.Drop,g);}h.drop.set("groups",f);return h;},destructor:function(){if(this.dd){this.dd.destroy();}if(e.Plugin.Drop){var f=e.one(this.get(c)).all(this.get(b));f.unplug(e.Plugin.Drop);}e.each(this._handles,function(g){g.detach();});}},{NAME:"delegate",ATTRS:{container:{value:"body"},nodes:{value:".dd-draggable"},invalid:{value:"input, select, button, a, textarea"},lastNode:{value:a},currentNode:{value:a},dragNode:{value:a},over:{value:false},target:{value:false},dragConfig:{value:null},handles:{value:null}}});e.mix(e.DD.DDM,{_delegates:[],regDelegate:function(f){this._delegates.push(f);},getDelegate:function(g){var f=null;g=e.one(g);e.each(this._delegates,function(h){if(g.test(h.get(c))){f=h;}},this);return f;}});e.namespace("DD");e.DD.Delegate=d;},"3.2.0",{skinnable:false,optional:["dd-drop-plugin"],requires:["dd-drag","event-mouseenter"]});YUI.add("dd",function(a){},"3.2.0",{use:["dd-ddm-base","dd-ddm","dd-ddm-drop","dd-drag","dd-proxy","dd-constrain","dd-drop","dd-scroll","dd-delegate"],skinnable:false});