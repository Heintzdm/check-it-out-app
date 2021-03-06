    function billCollect(){
      $("tr.bill_item").each(function(){
        $this = $(this)
        console.log($this)
        var name = $(this).children(".item_name").text();
        var price = $(this).children(".item_price").text();
        var merch_id = $(this).children(".merch_id").text();
        var item_id = $(this).children(".item_id").text();
        var newItem = new Item(name, price, merch_id, item_id);
        bill.addItem(newItem);
        var total = bill.total();
        $("#bill_total").text("$"+total/100);
      });
    };

  $(document).ready(function(){

    bill = new Bill(); //fix the initial total when editing bill

    billCollect();

    var billID = $(".bill_id").text()

    $(".line_item").draggable({
      helper: "clone"
    });

    $("#bill").on('mouseover', ".bill_item", function(){
      $(this).draggable({
        helper: "clone"
      })
    });

    $("#bill").droppable({
      accept: ".line_item",
      drop: handleDropEvent
    });

    $("body").droppable({
      accept: ".bill_item",
      drop: removeItemEvent
    });

    function handleDropEvent(event, ui){
      var menuItem = ui.draggable
      $(menuItem.clone()).appendTo("#bill tbody").attr("class", "bill_item");
      var name = $(menuItem).children(".item_name").text();
      var price = $(menuItem).children(".item_price").text();
      var merch_id = $(menuItem).children(".merch_id").text();
      var item_id = $(menuItem).children(".item_id").text();
      var newItem = new Item(name, price, merch_id, item_id);
      bill.addItem(newItem);
      var total = bill.total();
      $("#bill_total").text("$"+total/100);
    }

    function removeItemEvent(event, ui){
      var menuItem = ui.draggable;
      var itemName = (menuItem.children().first().text());
      var item = $.grep(bill.items, function(e){return e.name === itemName});
      var index = bill.items.findIndex(function (x) {
        return x.name == item[0].name;
      });


      $(menuItem).remove();
      bill.items.splice(index, 1);
      var total = bill.total();
      $("#bill_total").text("$"+total/100);
    };

   $("#clear_bill").on("click", function(){
    bill.clear();
    $("#bill tbody").empty();
    $("#bill_total").text("$0.00");
   });

   $("#transmit_order").on("click", function(){
    var myBill = {};
    var url = '/bills/' + billID
    for (var i = 0; i < bill.items.length; i++) {
      var item = bill.items[i];
      myBill[i] = {
        "item_id" : item.merchant_item_id,
        "item" : item.name,
        "price" : item.price,
        "merchant_id" : item.merchant_id
      };
    }

    $.ajax({
      type: "PUT",
      url: url,
      data: myBill,
      dataType: "json",
      success: function(data) {
        console.log(data)
        if (data.location) {
          window.location.href = data.location;
        }
      }
    });

   });
  });
