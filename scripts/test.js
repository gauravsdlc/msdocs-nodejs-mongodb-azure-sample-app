let Deploy = require("./deploy");

let Mint = require("./mint");


let main = async () => {


    function wait(milisec) {
        return new Promise(resolve => {
            setTimeout(() => { resolve('') }, milisec);
        })
    }



    let res = await Deploy({
        contractName: "StarDFstContract",
        tokenTracker: "SDFSC",
        baseURL: "https://stardust-asset-qa.s3.ap-southeast-1.amazonaws.com/uploads/land/cd-dt/",
        maxSupply: 72
    })
    console.log("res for deploy : ", res.address);

    // await wait(3000);

    // for (let i = 0; i < 70; i++) {
    //     let mintRes = await Mint({
    //         contractAddress: "0xe53d25598CeBa649333bb5B5FC33FEa625530cb5",
    //         transferTo: '0xF52f595358a2983F8970395eCF0F61eeadcF9537'
    //     })
    // }

    // console.log("mint Res : ", mintRes.tokenId);

}

main();