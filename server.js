const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db;
var s;

MongoClient.connect('mongodb://localhost:27017/InventoryManagement', (err, database) => {
    if (err) return console.log(err)
    db = database.db('InventoryManagement')
    app.listen(5000, () => {
        console.log('listening at port 5000')
    })
})

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json())
app.use(express.static('public'))


app.get('/', (req, res) => {
    db.collection('RationShop').find().toArray((err, result) => {
        if (err) return console.log(err)
        res.render('hometry.ejs', {
            data: result
        })
    })
})


app.get('/create', (req, res) => {
    res.render('add.ejs')
})

app.get('/updatestock', (req, res) => {
    res.render('update.ejs')
})

app.get('/deleteproduct', (req, res) => {
    res.render('delete.ejs')
})


app.get('/visualize', (req, res) => {
    db.collection('RationShop').find().toArray((err, result) => {
        if (err) return console.log(err + "MYYY error")
        var labels = []
        var stocks = []
        var data2 = []

        for (var i = 0; i < result.length; i++) {
            labels.push(result[i].pname)
            stocks.push(parseInt(result[i].stock))
        }
        data2.push(labels)
        data2.push(stocks)
        console.log(data2[0])
        console.log(data2[1])
        res.render('bar.ejs', {
            mydata: data2
        })
    })
})



app.post('/AddData', (req, res) => {
    db.collection('RationShop').save(req.body, (err, result) => {
        if (err) return console.log(err)
        setTimeout(function () {
            res.redirect('/')
        }, 3005);
    })
})

app.post('/update', (req, res) => {
    db.collection('RationShop').find().toArray((err, result) => {
        if (err) return console.log(err)
        console.log(req.body.pid)
        for (var i = 0; i < result.length; i++) {
            if (result[i].pid == req.body.pid) {
                s = result[i].stock
                break
            }
        }
        db.collection('RationShop').findOneAndUpdate({
                pid: req.body.pid
            }, {
                $set: {
                    stock: parseInt(s) + parseInt(req.body.stock)
                }
            }, {
                sort: {
                    _id: -1
                }
            },
            (err, result) => {
                if (err) return res.send(err);
                console.log(req.body.pid + 'stock updated')
                setTimeout(function () {
                    res.redirect('/')
                }, 3005);
            })

    })
})

app.post('/delete', (req, res) => {
    db.collection('RationShop').findOneAndDelete({
        pid: req.body.pid
    }, (err, result) => {
        if (err) return console.log(err)
        setTimeout(function () {
            res.redirect('/')
        }, 3005);
    })
})



app.post('/deleteproduct2', (req, res) => {
    db.collection('RationShop').findOneAndDelete({
        pid: req.body.delpid
    }, (err, result) => {
        if (err) return console.log(err)
        setTimeout(function () {
            res.redirect('/')
        }, 3005);
    })
})




app.post('/updatestock2', (req, res) => {
    const x = req.body.updatepid
    res.render('update2.ejs', {
        x
    })
})