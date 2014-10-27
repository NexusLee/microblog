docs.forEach(function(doc) {
    // item 对应每条记录
    doc.create_at_string = moment(doc.create_at).format('YYYY-MM-DD');
    doc.update_at_string = moment(doc.update_at).format('YYYY-MM-DD');
    // doc.update_at = moment(doc.update_at).format('YYYY-MM-DD');

})