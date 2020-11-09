function doGet(e)
{
  var t = HtmlService.createTemplateFromFile("main"); // Create HTML Form
  var today = new Date();
  var dt = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate(); // Date 
  
  // Get Data from Sheets 
  var wb = SpreadsheetApp.getActive();
  var sheet = wb.getSheetByName("Form Responses 1");
  var data = sheet.getDataRange().getValues();
  var headers = data.shift();
  
  // Allow for Proxy Backdoor for Checks
  var proxy = e.parameter.email;
  if (proxy) {
    var user = proxy;
  } else {
    var user = Session.getActiveUser().getEmail();
  };
  
  // User timesheet data
  var userdata = data.filter(r => r[1]==user);
  var duration = userdata.map(r => r[5]);
  const arrSum = arr => arr.reduce((a,b) => a + b, 0);
  var durSum = arrSum(duration);
  var durSum2 = Math.round(durSum,2)

  // User Metadata
  var usersheet = wb.getSheetByName("Users");
  var md = usersheet.getDataRange().getValues();
  md.shift()
  
  var userdf = md.filter(r => r[0] == user).flat();
  var userfname = userdf[2];
  var userwage = userdf[4];
  
  var grosspay = durSum*userwage;
  var grossadj = Math.round(grosspay,2);
  
  var totalpay = Math.round(userwage*2080,2);
  
  if(grosspay > totalpay){ 
    var wagemessage = "You have worked more than a full time job, congrats rich boi";
    } else { 
    var wagemessage = "Still got work to do. Get back to it and make that bread, broke boi!";
    };
   
   var paydate = today.setDate(1);
   var payperioddata = userdata.filter(r => r[2] >= paydate);
   var pphours = payperioddata.map(r => r[5]);
   var tpp = arrSum(pphours);
   var tppround = Math.round(tpp);
   var ppmoney = Math.round(tpp*userwage, 2);
   
   var workdest = userdf[6];
   var workname = userdf[7];
   var home = userdf[8];
   var route = Maps.newDirectionFinder()
    .setOrigin(home)
    .setDestination(workdest)
    .setMode(Maps.DirectionFinder.Mode.DRIVING)
    .getDirections();
   var routeduration = route["duration"];
   
   var map = Maps.newStaticMap()
    .beginPath()
    .addAddress(home)
    .addAddress(workdest)
    .endPath()
    .addMarker(home)
    .addMarker(workdest)
    .getMapUrl();
  
  var map2 = map + "&key=AIzaSyCkoPQhdP86NdLhD5SWUupNFTOGmUc98C4"
  
  t.datatable = userdf;
  t.wage = userwage;
  t.firstname = userfname;
  t.grosspay = grossadj;
  t.hours = durSum2;
  t.wage = userwage;
  t.fulltime = totalpay;
  t.wagemessage = wagemessage;
  t.tpp = tppround;
  t.ppmoney = ppmoney;
  t.duration = routeduration;
  t.work = workname;
  t.map = map2;
  return t.evaluate();
}  

function sendmessage(t)
{
  var message = {
                  to: t,
                  subject: "Hours are ready",
                  body: "Hello, <br> <br> Please check the timesheet app to view updated hours. <br> <br> Best, <br> Google "
                };


  MailApp.sendEmail(message);

}







