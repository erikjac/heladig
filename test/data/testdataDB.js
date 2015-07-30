id = ObjectId()

db.yogacourses.insert(
    {
      _id: id,
      startDate: new Date("2015-08-17"),
      endDate: new Date("2015-12-14"),
      weekday: "Måndag",
      timeStart: "18:30",
      timeEnd: "19:45",
      instructor: "Agneta Persevall",
      description: "Fortsättning, utövat yoga tidigare", 
      seats: 7
    }
)

db.yogaevents.insert( {
  date: new Date("2015-08-17"),
  startTime: new Date("2015-08-17:18:30"),
  endTime: new Date("2015-07-17:19:45"),
  instructor: "Agneta Persevall",
  seatsLeft: 0,
  participants:[{
          firstName: "Erik",
          lastName: "Jacobson",
          email: "erik.jacobson@gmail.com",
          phonenr: "0703585576"}],
  course: id
})


db.yogaevents.insert( {
  date: new Date("2015-12-14"),
  startTime: new Date("2015-12-14:18:30"),
  endTime: new Date("2015-12-14:19:45"),
  instructor: "Agneta Persevall",
  seatsLeft: 2,
  participants:[{
          firstName: "Erik",
          lastName: "Jacobson",
          email: "erik.jacobson@gmail.com",
          phonenr: "0703585576"}],
  course: id
})

id = ObjectId()

db.yogacourses.insert(
    {
      _id: id,
      startDate: new Date("2015-08-18"),
      endDate: new Date("2015-12-15"),
      weekday: "Tisdag",
      timeStart: "09:15",
      timeEnd: "10:30",
      instructor: "Måns Härngren",
      description: "Nystart", 
      seats: 7
    }
)


db.yogaevents.insert( {
  date: new Date("2015-08-18"),
  startTime: new Date("2015-08-18:09:15"),
  endTime: new Date("2015-08-18:10:30"),
  instructor: "Måns Härngren",
  seatsLeft: 1,
  participants:[{
          firstName: "Erik",
          lastName: "Jacobson",
          email: "erik.jacobson@gmail.com",
          phonenr: "0703585576"}],
  course: id
})


db.yogaevents.insert( {
  date: new Date("2015-12-15"),
  startTime: new Date("2015-12-15:09:15"),
  endTime: new Date("2015-12-15:10:30"),
  instructor: "Måns Härngren",
  seatsLeft: 0,
  participants:[{
          firstName: "Erik",
          lastName: "Jacobson",
          email: "erik.jacobson@gmail.com",
          phonenr: "0703585576"}],
  course: id
})



