import{l as n,I as h}from"./wrapEmojiText-Z5lY_FPx.js";class d{constructor(i,t){this.inputField=i,this.size=t,this.max=45,this.needFrame=0,this.container=document.createElement("div"),this.container.classList.add("media-sticker-wrapper");const e=i.input;e.addEventListener("blur",()=>{this.playAnimation(0)}),e.addEventListener("input",o=>{this.playAnimation(i.value.length)})}playAnimation(i){if(!this.animation)return;i=Math.min(i,30);let t;i?(t=Math.round(Math.min(this.max,i)*(165/this.max)+11.33),this.idleAnimation&&(this.idleAnimation.stop(!0),this.idleAnimation.canvas[0].style.display="none"),this.animation.canvas[0].style.display=""):t=0;const e=this.needFrame>t?-1:1;this.animation.setDirection(e),this.needFrame!==0&&t===0&&this.animation.setSpeed(7),this.needFrame=t,this.animation.play()}load(){return this.loadPromise?this.loadPromise:this.loadPromise=Promise.all([n.loadAnimationAsAsset({container:this.container,loop:!0,autoplay:!0,width:this.size,height:this.size},"TwoFactorSetupMonkeyIdle").then(i=>(this.idleAnimation=i,this.inputField.value.length||i.play(),n.waitForFirstFrame(i))),n.loadAnimationAsAsset({container:this.container,loop:!1,autoplay:!1,width:this.size,height:this.size},"TwoFactorSetupMonkeyTracking").then(i=>(this.animation=i,this.inputField.value.length||(this.animation.canvas[0].style.display="none"),this.animation.addEventListener("enterFrame",t=>{(this.animation.direction===1&&t>=this.needFrame||this.animation.direction===-1&&t<=this.needFrame)&&(this.animation.setSpeed(1),this.animation.pause()),t===0&&this.needFrame===0&&this.idleAnimation&&(this.idleAnimation.canvas[0].style.display="",this.idleAnimation.play(),this.animation.canvas[0].style.display="none")}),n.waitForFirstFrame(i)))])}remove(){this.animation&&this.animation.remove(),this.idleAnimation&&this.idleAnimation.remove()}}class m extends h{constructor(i){super(Object.assign(i,{plainText:!0})),this.options=i;const t=this.input;t.type="tel",t.setAttribute("required",""),t.autocomplete="off";let e=0;this.input.addEventListener("input",o=>{this.input.classList.remove("error"),this.setLabel();const l=this.value.replace(/\D/g,"").slice(0,i.length);this.setValueSilently(l);const s=this.value.length;if(s===i.length)i.onFill(this.value);else if(s===e)return;e=s})}}export{m as C,d as T};
//# sourceMappingURL=codeInputField-xS_iuES4.js.map
