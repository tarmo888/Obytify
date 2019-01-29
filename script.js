function savePNG() {
	try {
		var data = canvas.toDataURL('image/png');
		if (data.indexOf('data:image/png') == 0) {
			if (typeof ga === 'function') {
				ga('send', 'event', 'save-png', 'success');
			}
			downloadURI(data, "download.png");
		}
		else {
			if (typeof ga === 'function') {
				ga('send', 'event', 'save-png', 'unknown file');
			}
			alert('Unknown file type');
		}
	}
	catch (e) {
		if (typeof ga === 'function') {
			ga('send', 'event', 'save-png', 'error');
		}
		alert(e.message);
	}
}
function downloadURI(uri, name) {
	var link = document.createElement("a");
	link.download = name;
	link.href = uri;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	delete link;
}
function supportsCanvas() {
  return !!document.createElement('canvas').getContext;
}
function refreshCover() {
	if (custom_img) {
		if (typeof ga === 'function') {
			ga('send', 'event', 'refresh-cover', 'custom-img-yes');
		}
		drawCover();
	}
	else {
		$('#drawCover').hide();
		$('#savePNG').hide();
		$('#cover_canvas').hide();
		if (typeof ga === 'function') {
			ga('send', 'event', 'refresh-cover', 'custom-img-no');
		}
	}
	if ($('#cover_ratio option:selected').attr('rel')) {
		$('.ratio-text').hide();
		$('#'+$('#cover_ratio option:selected').attr('rel')).show();
	}
	else {
		$('.ratio-text').hide();
		$('#other-ratio').show();
	}
}
function handleImage(e){
	$('#drawCover').hide();
	$('#savePNG').hide();
	$('#cover_canvas').hide();
	if (typeof ga === 'function') {
		ga('send', 'event', 'file-upload', 'started');
	}
	var reader = new FileReader();
	reader.onload = function(event){
		custom_img = new Image();
		custom_img.onload = function(){
			custom_img_witdh = this.width;
			custom_img_height = this.height;
			$('#drawCover').show();
			if (typeof ga === 'function') {
				ga('send', 'event', 'file-upload', 'uploaded');
			}
			drawCover();
		}
		custom_img.src = event.target.result;
	}
	reader.readAsDataURL(e.target.files[0]);
}
function drawCover() {
	var ctx = canvas.getContext('2d');
	var open_x = 110;
	var open_y = 150;
	var open_width = 520-open_x;
	var open_height = 560-open_y;
	var ratio = $('#cover_ratio').val();
	var canvas_width = window.innerWidth*0.8;
	var canvas_height = canvas_width/ratio;
	if (canvas_height > window.innerWidth*0.8) {
		canvas_height = window.innerWidth*0.8;
		canvas_width = canvas_height*ratio;
	}
	canvas.width = canvas_width;
	canvas.height = canvas_height;
	$('#savePNG').show();
	$('#cover_canvas').show();

	//ctx.globalCompositeOperation = 'destination-over';
	ctx.fillStyle = 'white';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	var logo = new Image();
	logo.onload = function() {
		var width_fits = this.width / canvas.width;
		if (width_fits > 1) {
			this.width /= width_fits;
			this.height /= width_fits;
			open_x /= width_fits;
			open_y /= width_fits;
			open_width /= width_fits;
			open_height /= width_fits;
		}
		var height_fits = this.height / canvas.height;
		if (height_fits > 1) {
			this.width /= height_fits;
			this.height /= height_fits;
			open_x /= height_fits;
			open_y /= height_fits;
			open_width /= height_fits;
			open_height /= height_fits;
		}
		var logo_x = (canvas.width/2)-(this.width/2);
		var logo_y = (canvas.height/2)-(this.height/2);

		// reset to original size
		custom_img.width = custom_img_witdh;
		custom_img.height = custom_img_height;
		width_fits = custom_img.width / open_width;
		if (width_fits > 1) {
			custom_img.width /= width_fits;
			custom_img.height /= width_fits;
		}
		height_fits = custom_img.height / open_height;
		if (height_fits > 1) {
			custom_img.width /= height_fits;
			custom_img.height /= height_fits;
		}
		var custom_x = logo_x + open_x;
		var custom_y = logo_y + open_y;
		if (custom_img.width < custom_img.height) {
			custom_x += (open_width/2)-(custom_img.width/2);
		}
		else if (custom_img.width > custom_img.height) {
			custom_y += (open_height/2)-(custom_img.height/2);
		}

		ctx.drawImage(custom_img, custom_x, custom_y, custom_img.width, custom_img.height);
		ctx.drawImage(logo, logo_x, logo_y, this.width, this.height);

		if (!custom_img.rel) {
			if (width_fits < 1 && height_fits < 1) {
				custom_img.rel = 'warned';
				if (typeof ga === 'function') {
					ga('send', 'event', 'file-upload', 'not-big-enough');
				}
				setTimeout(function() {
					alert('Not big enough avatar.\nPlease upload bigger resolution for better result.');
				}, 1);
			}
			else if (Math.round(custom_img_witdh/custom_img_height*10)/10 != 1) {
				custom_img.rel = 'warned';
				if (typeof ga === 'function') {
					ga('send', 'event', 'file-upload', 'not-square');
				}
				setTimeout(function() {
					alert('Not square avatar.\nPlease upload square image for better result.');
				}, 1);
			}
		}
	}
	logo.src = 'obyte-mask.svg';
}