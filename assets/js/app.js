let dir = 'r'
updateValues()
document.querySelectorAll('div.currencies>div').forEach(
    el=>{
        el.addEventListener('click',clickHandler)
    }
)

async function clickHandler(e){
    e.target.parentNode.querySelectorAll('div').forEach(el=>el.classList.remove('active'))
    e.target.classList.add('active')
    updateValues()
}
document.querySelector('div.source>div.amount>p#amount').addEventListener('input',(e)=>{
    dir = 'r'
    updateValues()})
document.querySelector('div.target>div.amount>p#amount').addEventListener('input',(e)=>{
    dir = 'l'
    updateValues()})
async function updateValues(){
    if (!navigator.onLine){
        document.querySelector('#error').textContent = 'İnternet bağlantısında problem var.'
        return
    }
    let base = document.querySelector(`div.source>div.currencies>div.active`).textContent
    let target = document.querySelector(`div.target>div.currencies>div.active`).textContent
    let rate
    let revRate
    if (base===target){
        rate = 1
        revRate = 1
    } else {
        rate = await getRates(base, target)
        revRate = await getRates(target, base)
    }
    document.querySelector("div.source #rate").textContent = `1 ${base} = ${rate} ${target}`
    document.querySelector("div.target #rate").textContent = `1 ${target} = ${revRate} ${base}`
    if (dir==='r'){
        document.querySelector("div.target .amount>p#amount").textContent = Math.round(rate * Number(document.querySelector("div.source #amount")?.textContent?.replace(/,/g,'.').match(/[\d\.]/g)?.join('')||0)*10000)/10000
    } else {
        document.querySelector("div.source .amount>p#amount").textContent = Math.round(revRate * Number(document.querySelector("div.target #amount")?.textContent?.replace(/,/g,'.').match(/[\d\.]/g)?.join('')||0)*10000)/10000
    }
}

async function getRates(base,target){
    let response = await fetch(`https://api.exchangerate.host/latest?base=${base}&symbols=${target}`).then(resp=>resp.json()).catch(err=>{console.log(err)});
    let rate = response?.rates?.[target]
    return rate
}