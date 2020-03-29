	<script>
		
		$(document).ready(function() {
			$("a.on").click(function(){	
				$('#openclose').each(function() {
					var Sales = $(this).text();

					if ((year_opened = 2099) {
						$(this).css('backgroundColor', '#f76e6e'); 
					} 
					else {
						$(this).css('backgroundColor', '#99faa0'); 
					}
				});
				return false;
			});
			$("a.off").click(function(){	
				$('#openclose').each(function() {
					$(this).css('backgroundColor', 'transparent'); 
				});
			});
		});

		</script>