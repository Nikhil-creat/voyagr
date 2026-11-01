module.exports=(req,res)=>{res.setHeader('Cache-Control','no-store');res.status(200).json({ok:true,app:'voyagr',version:'7.0',time:new Date().toISOString()})};
