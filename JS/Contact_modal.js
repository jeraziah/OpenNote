//show the contact modal
$('#navOptionContact').click(function() {
	$('#contactModal').modal('show');
});

$('#contact_Send').click(function() {
    $('#contactModal').modal('hide');
    $('#previewContactEmailModal').modal('show');
});