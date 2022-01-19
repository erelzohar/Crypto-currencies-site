/// <reference path="jquery-3.5.1.js" />
/// <reference path="jquery-ui.min.js" />

"use strict";




//coin more info display  : 
export function coinDataDisplay(coinDataArr) {
    const coinListHtml = `<p>Current price : <br>
    ${coinDataArr.market_data.current_price.eur} Euro<br>
    ${coinDataArr.market_data.current_price.ils} Shekel<br>
    ${coinDataArr.market_data.current_price.usd} Dollar</p>
    <img src="${coinDataArr.image.large}">`;
    return coinListHtml;
}



    //get Ajax data(url).
    export function getDataAsync(url) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: url,
                success: data => resolve(data),
                reject: err => reject(err)
            });
        });
    }

    //build a bootstrap card  :
    export function cardBuilder(index, coinsArr) {

        return `<div class="row col-xs-10 col-sm-5 col-lg-3" id="divCard${index}">
                        <div class="card">
                            <div class="card-body">
                                <h4 class="card-title">${coinsArr[index].symbol.toUpperCase()}</h4>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" value=""  id="flexCheckDefault${index}"/>
                                    <label class="form-check-label" for="flexCheckDefault">
                                        Show on Live reports
                                    </label>
                                </div>
                                <p class="card-text">${coinsArr[index].name}<br></p>
                                <div class="collapse" id="collapseDiv${index}">
                                    <div id="collapseText${index}" class="card card-body">
                                    </div>
                                </div>
                                <button class="btn btn-primary" id="infoBtn${index}" type="button" data-toggle="collapse" data-target="#collapseDiv${index}" aria-expanded="false" aria-controls="collapseDiv${index}">
                                    More info
                                </button>
                            </div>
                        </div>
                </div>`;

    }
   
    //check if the coin data exist on local storage and display the data on collapse :
    export async function StorageCheckAndDisplayAsync(index, coinsArray) {
        if (localStorage.getItem("coin" + index) === null) {
            const coinData = await getDataAsync(`https://api.coingecko.com/api/v3/coins/${coinsArray[index].id}`);
            localStorage.setItem("coin" + index, coinDataDisplay(coinData));
        }
        $(`#collapseText${index}`).html(localStorage.getItem("coin" + index));

        setTimeout(() => localStorage.removeItem("coin" + index), 120000);
    }
    //get index from btn id and append more info to the collapse
    export function moreInfo(coinListArray) {
        $(".btn-primary").click(() => {
            const index = getIndex(7);
            $(`#collapseText${index}`).html(`<img id="loadingGif" src="assets/images/loading.gif">`);
            StorageCheckAndDisplayAsync(index, coinListArray);
        })
    }
    //add check mark to the selected coins
    export function addCheckMark() {
        if (localStorage.getItem("reportsArray") !== null) {
            const reportsArray = JSON.parse(localStorage.getItem("reportsArray"));
            reportsArray.forEach((element) => {
                $(`#flexCheckDefault${element.id}`).prop("checked", true);
            });
        }
    }
    //get the coin index from btn id and change the btn text : 
    export function getIndex(substringNum) {
        const index = event.srcElement.id.substring(substringNum);
        $(`#infoBtn${index}`).html($(`#infoBtn${index}`).html() === "Close" ? "More info" : "Close");
        return index;
    }
    //when checkbox is clicked check if the coin exist on local storage
    //if it does delete the coin from the report if not add it to report
    export function addAndDeleteFromReport(coinListArray) {
        $(".form-check-input").click(() => {
            let localStorageCheck = true;
            const index = event.srcElement.id.substring(16);
            if (!localStorage.getItem("reportsArray")) {
                localStorage.setItem("reportsArray", JSON.stringify([]));
                const reportsArray = JSON.parse(localStorage.getItem("reportsArray"));
                reportsArray.push({ id: index, coinId: coinListArray[index].id });
                localStorage.setItem("reportsArray", JSON.stringify(reportsArray));
                alert("Added !");
            }

            else {
                const reportsArray = JSON.parse(localStorage.getItem("reportsArray"));
                reportsArray.forEach((element, elementIndex) => {
                    if (element.id === index) {
                        reportsArray.splice(elementIndex, 1);
                        alert("The coin has dropped from live reports.");
                        localStorage.setItem("reportsArray", JSON.stringify(reportsArray));
                        localStorageCheck = false;
                    }
                });
                //call the modal if true and if there is 5 coins in the report
                if (localStorageCheck === true) {
                    if (reportsArray.length === 5) {

                        $("#exampleModal").modal();
                        $(".modal-body").html(() => {
                            let modalReports = "";
                            const modalReportsArray = JSON.parse(localStorage.getItem("reportsArray"));
                            modalReportsArray.forEach(element => {
                                modalReports += cardBuilder(element.id, coinListArray);

                            });
                            return modalReports;
                        }
                        )
                        moreInfo(coinListArray);
                        $(".form-check-input").click(() => {
                            let indexNum = event.srcElement.id.substring(16);
                            const deleteFromReportArray = JSON.parse(localStorage.getItem("reportsArray"));
                            deleteFromReportArray.forEach((element, elementIndex) => {
                                if (element.id === indexNum) {
                                    deleteFromReportArray.splice(elementIndex, 1);
                                }
                            });
                            $("#saveBtn").click(() => {
                                localStorage.setItem("reportsArray", JSON.stringify(deleteFromReportArray));
                            });
                        });
                    }
                    else {
                        reportsArray.push({ id: index, coinId: coinListArray[index].id });
                        localStorage.setItem("reportsArray", JSON.stringify(reportsArray));
                        alert("Added !");
                    }
                }
            }
        })
    }














