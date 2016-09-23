//School Schedules

function timeslot(timestring, name){
    this.rawstring = timestring;

    this.rawname = name;

    var times_split = timestring.split("-");
    this.start_time = times_split[0];
    this.end_time = times_split[1];

    var date_now = new Date();

    var start_split = this.start_time.split(":");
    this.start_date = new Date(date_now.valueOf());
    this.start_date.setHours(start_split[0]);
    this.start_date.setMinutes(start_split[1]);
    this.start_date.setSeconds(0);

    var end_split = this.end_time.split(":");
    this.end_date = new Date(date_now.valueOf());
    this.end_date.setHours(end_split[0]);
    this.end_date.setMinutes(end_split[1]);
    this.end_date.setSeconds(0);

    this.padMinutes = function(minutes){
      if(minutes < 10){
        return "0" + minutes
      }
      return minutes
    }

    this.getNameString = function(){
      var s = "";
      if(this.start_date.getHours() > 12){
        s += this.start_date.getHours() - 12;
      } else {
        s += this.start_date.getHours();
      }
      s += ":" + this.padMinutes(this.start_date.getMinutes()) + "-";

      if(this.end_date.getHours() > 12){
        s += this.end_date.getHours() - 12;
      } else {
        s += this.end_date.getHours();
      }
      s += ":" + this.padMinutes(this.end_date.getMinutes());

      return s;
    };

    this.contains = function(other_date){
      return other_date.getTime() > this.start_date.getTime() && this.end_date.getTime() > other_date.getTime();
    };

    this.getTimeLeft = function(other_date){
      if(!this.contains(other_date)){
        return -1;
      } else {
        return Math.round((this.end_date.getTime() - other_date.getTime()) / (60 * 1000));
      }
    };

    this.toStringFormat = function(c_date){
      if(this.contains(c_date)){
        return "<div class=\"item\"><b>" + this.rawname + "</b> - " + this.getNameString() + ", <b>" + this.getTimeLeft(c_date) + " mins</b> left</div>";
      } else {
        return "<div class=\"item\"><b>" + this.rawname + "</b> - " + this.getNameString() + "</div>";
      }
    };
}

var ASchedule = [
  "A, Regular",
  [
    new timeslot("7:20-8:13", "1st"),
    new timeslot("8:19-9:15", "2nd"),
    new timeslot("9:21-10:14", "3rd"),
    new timeslot("12:48-13:41", "6th"),
    new timeslot("13:47-14:40", "7th"),
    new timeslot("14:50-15:15", "Tutorials")
  ],
  {
    "none": [new timeslot("10:14-12:42", "4th, 5th, Lunch")],
    "a": [
      new timeslot("10:14-10:44", "A Lunch"),
      new timeslot("10:50-11:43", "4th"),
      new timeslot("11:49-12:42", "5th")
    ],
    "b": [
      new timeslot("10:20-11:13", "4th"),
      new timeslot("11:13-11:43", "B Lunch"),
      new timeslot("11:49-12:42", "5th")
    ],
    "c": [
      new timeslot("10:20-11:13", "4th"),
      new timeslot("11:13-12:12", "5th"),
      new timeslot("12:12-12:42", "C Lunch")
    ]
  }
];

var BSchedule = [
  "B, Extended 2nd Period",
  [
    new timeslot("7:20-8:07", "1st"),
    new timeslot("8:13-9:03", "2nd"),
    new timeslot("9:03-9:33", "Assembly"),
    new timeslot("9:39-10:26", "3rd"),
    new timeslot("13:00-13:47", "6th"),
    new timeslot("13:53-14:40", "7th"),
    new timeslot("14:50-15:15", "Tutorials")
  ],
  {
    "none": [new timeslot("10:26-12:54", "4th, 5th, Lunch")],
    "a": [
      new timeslot("10:26-10:56", "A Lunch"),
      new timeslot("11:02-11:55", "4th"),
      new timeslot("12:01-12:54", "5th")
    ],
    "b": [
      new timeslot("10:32-11:25", "4th"),
      new timeslot("11:25-11:55", "B Lunch"),
      new timeslot("12:01-12:54", "5th")
    ],
    "c": [
      new timeslot("10:32-11:25", "4th"),
      new timeslot("11:31-12:24", "5th"),
      new timeslot("12:24-12:54", "C Lunch")
    ]
  }
];

var CSchedule = [
  "C, Pep Rally",
  [
    new timeslot("7:20-8:06", "1st"),
    new timeslot("8:12-9:01", "2nd"),
    new timeslot("9:07-9:53", "3rd"),
    new timeslot("12:28-13:13", "6th"),
    new timeslot("13:19-14:40", "7th/Pep Rally"),
    new timeslot("14:50-15:15", "Tutorials")
  ],
  {
    "none": [new timeslot("9:53-12:22", "4th, 5th, Lunch")],
    "a": [
      new timeslot("9:53-10:23", "A Lunch"),
      new timeslot("10:29-11:22", "4th"),
      new timeslot("11:28-12:22", "5th")
    ],
    "b": [
      new timeslot("9:59-10:52", "4th"),
      new timeslot("10:52-11:22", "B Lunch"),
      new timeslot("11:28-12:22", "5th")
    ],
    "c": [
      new timeslot("9:59-10:52", "4th"),
      new timeslot("10:58-11:52", "5th"),
      new timeslot("11:52-12:22", "C Lunch")
    ]
  }
];
