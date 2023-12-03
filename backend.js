const express  = require("express");
const app = express()


//bodyparser
const bodyParser = require("body-parser")



//firebase
const firebaseApp = require("firebase/app")
const firebaseAnalytics = require("firebase/analytics")
const firebaseDatabase = require("firebase/database")
const firebaseStore = require("firebase/firestore")
const firebaseDatabase_ref = firebaseDatabase.ref;
const firebaseDatabase_set = firebaseDatabase.set; 
const firebaseDatabase_onValue = firebaseDatabase.onValue
const firebaseConfig = {
    apiKey: "AIzaSyCZZMoKemwFJfcRH2HxF782cZQei32N0ZU",
    authDomain: "todowork-75f2f.firebaseapp.com",
    projectId: "todowork-75f2f",
    storageBucket: "todowork-75f2f.appspot.com",
    messagingSenderId: "475363089663",
    appId: "1:475363089663:web:0b54d6494d1b6bb797c0ca",
    measurementId: "G-3PTMP1HMKX"
};
const firebase_app = firebaseApp.initializeApp(firebaseConfig);
const db = firebaseDatabase.getDatabase()







//required for body parser used for get the post value
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


//ejs
app.set("view engine",require("ejs")) //ejs look for views folder and run the file 
//defining the folders so ejs can use this
app.use(express.static("public"))
app.use(express.static("public/images"))







//when u use ejs engine
app.get("/home",(req , res) => { //call back function
    let data;
    let dataRef = firebaseDatabase_ref(db,'todo/');
    firebaseDatabase_onValue(dataRef, (snapshot) => {
    data = snapshot.val();
    console.log(data)
    });
    res.render("index.ejs",{data:data})//we use render in ejs engine
})

// app.get("/home",(req , res) => { //call back function
//     res.sendFile(__dirname +"/index.html")
// })
// above if u dont use ejs engine



//getting data of counter from database
var dataRef = firebaseDatabase_ref(db,'todo/counter');
let counter
firebaseDatabase_onValue(dataRef, (snapshot) => {
    counter = snapshot.val();
    console.log(counter.counter)
});


//Post od add_item here
app.post("/post/add_task/",(req,res)=>{
    console.log(req.body) //goood to see this first
    const btn_id1 = req.body.btn_id1
    
    
    
    if(btn_id1 == 'ADD'){
    let task = req.body.task
    let time = req.body.time
    const refer = firebaseDatabase_ref(db,'todo/todo/'+JSON.stringify(counter.counter));
    firebaseDatabase_set(refer,{
                todo : task,
                time : time
    })
    counter.counter++
    const ref = firebaseDatabase_ref(db,'todo/counter');
    firebaseDatabase_set(ref,{
        counter: counter.counter
    })
    res.redirect("/home")
    }


    else if(btn_id1 == "DeleteALL"){
        firebaseDatabase.remove(firebaseDatabase_ref(db,'todo/todo/'))
        const ref = firebaseDatabase_ref(db,'todo/counter');
        firebaseDatabase_set(ref,{
                counter: 0
        })
        res.redirect("/home")
    }
})






//if data came from update or delete button
app.post("/todo/Update",(req,res)=>{
    console.log(req.body) //goood to see this first
    let task = req.body.task
    let time = req.body.time
    let t_counter = counter.counter
    t_counter-- 
    let number = req.body.number
    const buttonId = req.body.btn_id;



    if(buttonId == "Update"){
    const refer = firebaseDatabase_ref(db,'todo/todo/'+number);
    firebaseDatabase_set(refer,{
                todo : task,
                time : time
    })
    }



    else if(buttonId == "Delete"){
    console.log("i am here")
    const ref = firebaseDatabase_ref(db,'todo/counter');
    firebaseDatabase_set(ref,{
            counter: t_counter
    })
    firebaseDatabase.remove(firebaseDatabase_ref(db,'todo/todo/'+number))
}
    // const ref = firebaseDatabase_ref(db,'todo/counter');
    // firebaseDatabase_set(ref,{
    //             counter: counter.counter
    // })
    res.redirect("/home")
})

//getting data
// var dataRef = firebaseDatabase_ref(db,'todo/ahmad');
// firebaseDatabase_onValue(dataRef, (snapshot) => {
//     const data = snapshot.val();
//     console.log(data)
//   });
// Listen for changes in the data


// firebaseStore_deleteDoc(firebaseStore_doc(db, "todolist/", "ahmad"));


app.listen(6969,() =>{
    console.log("i am starting get aside")
})

