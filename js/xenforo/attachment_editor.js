/*
 * XenForo attachment_editor.min.js
 * Copyright 2010-2016 XenForo Ltd.
 * Released under the XenForo License Agreement: http://xenforo.com/license-agreement
 */
(function(e,m,k){var h=XenForo.speed.normal,g=XenForo.speed.fast,l=!1;XenForo.AttachmentUploader=function(b){l||(l=!0,e.browser.mozilla&&typeof SWFUpload=="function"&&e(function(){var a=XenForo.isRTL()?"9999em":"-9999em",b=e('<object width="100" height="100" type="application/x-shockwave-flash" style="visibility: hidden; position: absolute; top: 0; left: '+a+'" />').appendTo("body");setTimeout(function(){b.remove()},250)}));var f=e(b.data("trigger"));b.closest("form");var a=e(b.data("placeholder")),
c={},d=null,i=null,n=b.data("maxfilesize");b.data("maxuploads");var j=b.data("extensions"),g=b.data("uniquekey"),j=j.replace(/[;*.]/g,"").replace(/,{2,}/g,",").replace(/^,+/,"").replace(/,+$/,"");b.show();var h=XenForo.canonicalizeUrl(b.data("flashurl")||"js/swfupload/Flash/swfupload.swf");console.info("flash url: %s",h);typeof SWFUpload=="function"&&!m.navigator.userAgent.match(/Android|iOS|iPhone|iPad|Mobile Safari/i)&&(d=new SWFUpload({upload_url:b.data("action"),file_post_name:b.data("postname"),
file_types:"*."+j.toLowerCase().replace(/,/g,";*."),post_params:e.extend({_xfToken:XenForo._csrfToken,_xfNoRedirect:1,_xfResponseType:"json"},c),button_placeholder_id:a.attr("id"),button_width:1,button_height:1,button_window_mode:SWFUpload.WINDOW_MODE.TRANSPARENT,button_cursor:SWFUpload.CURSOR.HAND,flash_url:h,prevent_swf_caching:!1,swfupload_loaded_handler:function(){this.setButtonDimensions(f.outerWidth(),f.outerHeight());e(this.movieElement).css("top",f.position().top);b.find(".HiddenInput").each(function(a,
b){d.addPostParam(e(b).data("name"),e(b).data("value"))});e(k).bind("CSRFRefresh",function(a){a.ajaxData&&(d.addPostParam("_xfToken",a.ajaxData.csrfToken),d.addPostParam("_xfSessionId",a.ajaxData.sessionId))})},file_dialog_complete_handler:function(){try{this.getStats().files_queued>0&&this.startUpload(this.getFile(0).ID)}catch(a){this.debug(a)}},file_queued_handler:function(a){var c;switch(a.name.substr(a.name.lastIndexOf(".")).toLowerCase()){case ".jpg":case ".jpeg":case ".jpe":case ".png":case ".gif":c=
!0;break;default:c=!1}var d=e.Event("AttachmentQueueValidation");d.file=a;d.swfUpload=this;d.isImage=c;b.trigger(d);if(!d.isDefaultPrevented())a.size>n&&!c?(this.cancelUpload(a.id,!1),typeof this.settings.file_queue_error_handler=="function"&&this.settings.file_queue_error_handler.call(this,a,SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT,"The uploaded file is too large.")):(d=e.Event("AttachmentQueued"),d.file=a,d.swfUpload=this,d.isImage=c,b.trigger(d))},file_queue_error_handler:function(a,c,d){var f=
e.Event("AttachmentQueueError");f.file=a;f.errorCode=c;f.message=d;f.swfUpload=this;b.trigger(f);f.isDefaultPrevented()||i(a,c,d)},upload_start_handler:function(a){console.log("Uploading %s",a.name)},upload_progress_handler:function(a,c){b.trigger({type:"AttachmentUploadProgress",file:a,bytes:c,swfUpload:this})},upload_success_handler:function(a,c){try{var d=e.parseJSON(c)}catch(f){console.warn(f);return}d.error?b.trigger({type:"AttachmentUploadError",file:a,ajaxData:d,swfUpload:this}):b.trigger({type:"AttachmentUploaded",
file:a,ajaxData:d,swfUpload:this})},upload_error_handler:function(a,c,d){c!=SWFUpload.UPLOAD_ERROR.FILE_CANCELLED&&(console.warn("Upload failed: %o",arguments),b.trigger({type:"AttachmentUploadError",file:a,errorCode:c,message:d,ajaxData:{error:[b.data("err-unknown")]},swfUpload:this}))},upload_complete_handler:function(){try{this.getStats().files_queued>0?this.startUpload(this.getFile(0).ID):console.info("All files uploaded.")}catch(a){this.debug(a)}}}),i=function(a,c,d){c=b.data("err"+c)||d;a?XenForo.alert(c+
"<br /><br />"+a.name):XenForo.alert(c)});e(k).bind("AutoInlineUploadComplete",function(a){if(g&&a.ajaxData&&g!==a.ajaxData.key)return!1;if(e(a.target).is("form.AttachmentUploadForm"))return f.overlay()&&f.overlay().close(),b.trigger({type:"AttachmentUploaded",ajaxData:a.ajaxData}),!1});return{getSwfUploader:function(){return d},swfAlert:i}};XenForo.AttachmentEditor=function(b){this.setVisibility=function(a){var c=b.closest(".ctrlUnit"),d=b.find(".AttachmentInsertAllBlock"),e=b.find(".AttachedFile:not(#AttachedFileTemplate)"),
f=e.filter(".AttachedImage");console.log("Attachments changed, total files: %d, images: %d",e.length,f.length);c.length==0&&(c=b);a===!0?e.length?(f.length>1?d.show():d.hide(),c.show()):c.hide():e.length?(f.length>1?c.is(":hidden")?d.show():d.xfFadeDown(XenForo.speed.fast):c.is(":hidden")?d.hide():d.xfFadeUp(XenForo.speed.fast,!1,XenForo.speed.fast,"swing"),c.xfFadeDown(XenForo.speed.normal)):(d.slideUp(XenForo.speed.fast),c.xfFadeUp(XenForo.speed.normal,!1,!1,"swing"))};this.setVisibility(!0);e("#AttachmentUploader").bind({click:function(){e("textarea.BbCodeWysiwygEditor").each(function(){var a=
e(this).data("XenForo.BbCodeWysiwygEditor");a&&a.blurEditor()})},AttachmentQueued:function(a){console.info("Queued file %s (%d bytes).",a.file.name,a.file.size);var c=e("#AttachedFileTemplate").clone().attr("id",a.file.id);c.find(".Filename").text(a.file.name);c.find(".ProgressCounter").text("0%");c.find(".ProgressGraphic span").css("width","0%");a.isImage&&c.addClass("AttachedImage");c.xfInsert("appendTo",".AttachmentList.New",null,h);c.find(".AttachmentCanceller").css("display","block").click(function(){a.swfUpload.cancelUpload(a.file.id);
c.xfRemove(null,function(){b.trigger("AttachmentsChanged")},g,"swing")});b.trigger("AttachmentsChanged")},AttachmentUploadProgress:function(a){console.log("Uploaded %d/%d bytes.",a.bytes,a.file.size);var c=Math.min(100,Math.ceil(a.bytes*100/a.file.size)),d=c+"%",a=e("#"+a.file.id),b=a.find(".ProgressCounter"),f=a.find(".ProgressGraphic");b.text(d);f.css("width",d);c>=100&&a.find(".AttachmentCanceller").prop("disabled",!0).addClass("disabled");f.width()>b.outerWidth()&&b.appendTo(f)},AttachmentUploadError:function(a){var c=
"";e.each(a.ajaxData.error,function(a,b){c+=b+"\n"});XenForo.alert(c+"<br /><br />"+a.file.name);var d=e("#"+a.file.id),b=d.closest(".AttachmentEditor");d.xfRemove(null,function(){b.trigger("AttachmentsChanged")},g,"swing");console.warn("AttachmentUploadError: %o",a)},AttachmentUploaded:function(a){if(a.file){var c=e("#"+a.file.id),d=c.find(".AttachmentText"),f=e(a.ajaxData.templateHtml),g;d.fadeOut(XenForo.speed.fast,function(){f.find(".AttachmentText").xfInsert("insertBefore",d,"fadeIn",XenForo.speed.fast);
g=c.find(".Thumbnail");g.html(f.find(".Thumbnail").html());d.xfRemove();c.attr("id","attachment"+a.ajaxData.attachment_id)})}else c=e("#attachment"+a.ajaxData.attachment_id),c.length||(c=e(a.ajaxData.templateHtml).xfInsert("appendTo",b.find(".AttachmentList.New"),null,h));b.trigger("AttachmentsChanged")}});var f=e.context(this,"setVisibility");e("#QuickReply").bind("QuickReplyComplete",function(){b.find(".AttachmentList.New li:not(#AttachedFileTemplate)").xfRemove().promise().always(f)});b.bind("AttachmentsChanged",
f)};XenForo.AttachmentInserter=function(b){b.click(function(f){var a=b.closest(".AttachedFile").find(".Thumbnail a"),c=a.data("attachmentid"),d;d=a.find("img").attr("src");a=a.attr("href");f.preventDefault();b.attr("name")=="thumb"?(f="[ATTACH]"+c+"[/ATTACH] ",d='<img src="'+d+'" class="attachThumb bbCodeImage" alt="attachThumb'+c+'" /> '):(f="[ATTACH=full]"+c+"[/ATTACH] ",d='<img src="'+a+'" class="attachFull bbCodeImage" alt="attachFull'+c+'" /> ');if(c=XenForo.getEditorInForm(b.closest("form"),
":not(.NoAttachment)"))if(c.$editor){c.insertHtml(d);var e=c.$editor.data("xenForoElastic");e&&(setTimeout(function(){e()},250),setTimeout(function(){e()},1E3))}else c.val(c.val()+f)})};XenForo.AttachmentDeleter=function(b){b.css("display","block").click(function(b){var a=e(b.target),c=a.attr("href")||a.data("href"),d=a.closest(".AttachedFile"),b=a.closest(".AttachedFile").find(".Thumbnail a").data("attachmentid");if(c){d.xfFadeUp(XenForo.speed.normal,null,g,"swing");XenForo.ajax(c,"",function(a){if(XenForo.hasResponseError(a))return d.xfFadeDown(XenForo.speed.normal),
!1;var b=d.closest(".AttachmentEditor");d.xfRemove(null,function(){b.trigger("AttachmentsChanged")},g,"swing")});if(b&&(a=XenForo.getEditorInForm(a.closest("form"),":not(.NoAttachment)"))&&a.$editor)a.$editor.find("img[alt=attachFull"+b+"], img[alt=attachThumb"+b+"]").remove(),(b=a.$editor.data("xenForoElastic"))&&b();return!1}console.warn("Unable to locate href for attachment deletion from %o",a)})};XenForo.AttachmentInsertAll=function(b){b.click(function(){e(".AttachmentInserter[name="+b.attr("name")+
"]").each(function(b,a){e(a).trigger("click")})})};XenForo.AttachmentDeleteAll=function(b){b.click(function(){e(".AttachmentDeleter").each(function(b,a){e(a).trigger("click")})})};XenForo.register(".AttachmentUploader","XenForo.AttachmentUploader");XenForo.register(".AttachmentEditor","XenForo.AttachmentEditor");XenForo.register(".AttachmentInserter","XenForo.AttachmentInserter");XenForo.register(".AttachmentDeleter","XenForo.AttachmentDeleter");XenForo.register(".AttachmentInsertAll","XenForo.AttachmentInsertAll");
XenForo.register(".AttachmentDeleteAll","XenForo.AttachmentDeleteAll")})(jQuery,this,document);