var quizController = (function(){
    //***********Question Constructor***********
    function Question(id,questionText,options,correctAnswer){
        this.id=id;
        this.questionText=questionText;
        this.options=options;
        this.correctAnswer=correctAnswer;
    }
    var questionLocalStorage={
        setQuestionCollection:function(newCollection){
            localStorage.setItem('questionCollection',JSON.stringify(newCollection));
        },
        getQuestionCollection:function(){
            return JSON.parse(localStorage.getItem('questionCollection'));
        },
        removeQuestionCollection:function(){
        localStorage.removeItem('questionCollection');
    }
    };
    if(questionLocalStorage.getQuestionCollection()===null){
                questionLocalStorage.setQuestionCollection([]);
    }
    var quizProgress={
        questionIndex:0
    };
    return{
        getQuizProgress:quizProgress,
        getQuestionLocalStorage:questionLocalStorage,
        addQuestionsOnLocalStorage:function(newQuesText,opts){
            var optionArr,corrAns,questionId,newQuestion,getStoredQuests,isChecked;
            if(questionLocalStorage.getQuestionCollection()===null){
                questionLocalStorage.setQuestionCollection([]);
            }
            optionArr=[];
            isChecked=false;
            for(let k=0;k<opts.length;k++){
                if(opts[k].value!==""){
                    optionArr.push(opts[k].value);
                }
                if(opts[k].previousElementSibling.checked && opts[k].value!==""){
                    corrAns=opts[k].value;
                    isChecked=true;
                }
                    
            }
            if(questionLocalStorage.getQuestionCollection().length>0){
                questionId=questionLocalStorage.getQuestionCollection()[questionLocalStorage.getQuestionCollection().length-1].id+1;
            }else{
                questionId=0;
            }
            if(newQuesText.value!==""){
                if(optionArr.length>1){
                    if(isChecked){
    
                      newQuestion=new Question(questionId,newQuesText.value,optionArr,corrAns);
                      getStoredQuests=questionLocalStorage.getQuestionCollection();
                      getStoredQuests.push(newQuestion);
                      questionLocalStorage.setQuestionCollection(getStoredQuests);
                      newQuesText.value="";
                      for(var i=0;i<opts.length;i++){
                        opts[i].value="";
                        opts[i].previousElementSibling.checked=false;
                
                      }
                      console.log(questionLocalStorage.getQuestionCollection())
                        return true;
                    }else{
                        alert('You missed to check correct answer,or you checked answer without value');
                        return false;
                    }
                
            }else{
                window.alert('You must fill atleast two options');
                return false;
            }
        }else{
        alert('Please,Insert Question');
            return false;
       }
                
    }
    };
    
})();

var UIController=(function(){
    var domItems={
        //*********Admin Panel Ements***********
        questInsertBtn:document.getElementById("question-insert-btn"),
        newQuestionText:document.getElementById("new-question-text"),
        adminOptions:document.querySelectorAll(".admin-option"),
        adminOptionsContainer:document.querySelector(".admin-option-container"),
        insertedQuestsWrapper:document.querySelector(".inserted-questions-wrapper"),
        questionUpdateBtn:document.getElementById("question-update-btn"),
        questionDeleteBtn:document.getElementById("question-delete-btn"),
        questionClearBtn:document.getElementById("questions-clear-btn"),
        //**********Quiz section************
        askedQuestText:document.getElementById("asked-question-text")
    };
    return{
        getDomItems:domItems,
        addInputsDynamically:function(){
            var addInput=function(){
                var inputHTML,z;
                z=document.querySelectorAll('.admin-option').length;
                inputHTML='<div class="admin-option-wrapper"><input type="radio" class="admin-option-'+z+'" name="answer" value="0"><input type="text" class="admin-option admin-option-'+z+'" value=""></div>';
                domItems.adminOptionsContainer.insertAdjacentHTML('beforeend',inputHTML);
                domItems.adminOptionsContainer.lastElementChild.previousElementSibling.lastElementChild.removeEventListener('focus',addInput);
                domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener('focus',addInput);
            }
                        
           domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener('focus',addInput);
            

        },
        createQuestionList:function(getQuestions){
            var questHTML,numberingArr;
            numberingArr=[];
            domItems.insertedQuestsWrapper.innerHTML="";
            for(var i=0;i<getQuestions.getQuestionCollection().length;i++){
                numberingArr.push(i+1);
                questHTML='<p><span>'+numberingArr[i]+'. '+getQuestions.getQuestionCollection()[i].questionText+'</span><button id="Question-'+getQuestions.getQuestionCollection()[i].id+'">edit</button></p>';
                domItems.insertedQuestsWrapper.insertAdjacentHTML('afterbegin',questHTML);
            }

                
        },
        editQuestList:function(event,storageQuestList,addInpsDyn,updateQuestListFn){
            var getId, getStorageQuestList, foundItem, placeInArr,optionHTML;
            if('question-'.indexOf(event.target.id)){
                getId = parseInt(event.target.id.split('-')[1]);
                getStorageQuestList=storageQuestList.getQuestionCollection();
                for(var i=0;i<getStorageQuestList.length;i++){
                    if(getStorageQuestList[i].id===getId){
                        foundItem=getStorageQuestList[i];
                        placeInArr=i;
                    }
                }
                domItems.newQuestionText.value=foundItem.questionText;
                domItems.adminOptionsContainer.innerHTML='';
                optionHTML='';
                for(var x=0;x<foundItem.options.length;x++){
                    optionHTML+='<div class="admin-option-wrapper"><input type="radio" class="admin-option-'+x+'" name="answer" value="'+x+'"><input type="text" class="admin-option admin-option-'+x+'" value="'+foundItem.options[x]+'"></div>';
                }
                
                domItems.adminOptionsContainer.innerHTML=optionHTML;
                domItems.questionUpdateBtn.style.visibility='visible';
                domItems.questionDeleteBtn.style.visibility='visible';
                domItems.questInsertBtn.style.visibility='hidden';
                domItems.questionClearBtn.style.pointerEvents='none';
                addInpsDyn();
                var backDefaultView=function(){
                    var updateOptions;
                    domItems.newQuestionText.value="";
                    updateOptions=document.querySelectorAll(".admin-option");
                    for(var i=0;i<updateOptions.length;i++){
                        updateOptions[i].value="";
                        updateOptions[i].previousElementSibling.checked=false;
                    }
                    domItems.questionUpdateBtn.style.visibility='hidden';
                    domItems.questionDeleteBtn.style.visibility='hidden';
                    domItems.questInsertBtn.style.visibility='visible';
                    domItems.questionClearBtn.style.pointerEvents='';
                    updateQuestListFn(storageQuestList);
                }
                var updateQuestion=function(){
                    var newOptions,optionEls;
                    newOptions=[];
                    optionEls=document.querySelectorAll(".admin-option");
                    foundItem.questionText=domItems.newQuestionText.value;
                    foundItem.correctAnswer='';
                    for(var i=0;i<optionEls.length;i++){
                        if(optionEls[i].value!==''){
                            newOptions.push(optionEls[i].value);
                            if(optionEls[i].previousElementSibling.checked){
                                foundItem.correctAnswer=optionEls[i].value;
                            }
                        }
                    }
                    foundItem.options=newOptions;
                    if(foundItem.questionText!==''){
                        if(foundItem.options.length>1){
                            if(foundItem.correctAnswer!==''){
                                
                               getStorageQuestList.splice(placeInArr,1,foundItem);
                               storageQuestList.setQuestionCollection(getStorageQuestList);
                                backDefaultView();
                            }else{
                                alert('You missed to check correct answer,or you checked answer without value');
                            }
                        }else{
                            alert('You must insert atleast two options');
                        }
                    }else{
                        alert('Please,insert question');
                    }
                }
                domItems.questionUpdateBtn.onclick=updateQuestion;
                var deleteQuestion=function(){
                    getStorageQuestList.splice(placeInArr,1);
                    storageQuestList.setQuestionCollection(getStorageQuestList);
                    backDefaultView();
                }
                domItems.questionDeleteBtn.onclick=deleteQuestion;
            }
        },
        clearQuestList:function(storageQuestList){
          if(storageQuestList.getQuestionCollection()!==null){
            if(storageQuestList.getQuestionCollection().length>0){
                var conf=confirm('Warning! You will lose entire question list');
                if(conf){
                    storageQuestList.removeQuestionCollection();
                    domItems.insertedQuestsWrapper.innerHTML='';
                }
            }
        }
      },
      displayQuestion:function(storageQuestList,progress){
          if(storageQuestList.getQuestionCollection().length>0){
              domItems.askedQuestText.textContent=storageQuestList.getQuestionCollection()[progress.questionIndex].questionText;
          }
      }
    };
})();

var controller=(function(quizCtrl,UICtrl){
   var selectedDomItems=UICtrl.getDomItems;
    UICtrl.addInputsDynamically();
    UICtrl.createQuestionList(quizCtrl.getQuestionLocalStorage);
    selectedDomItems.questInsertBtn.addEventListener('click',function(){
        var adminOptions=document.querySelectorAll('.admin-option');
        var checkBoolean=quizCtrl.addQuestionsOnLocalStorage(selectedDomItems.newQuestionText,adminOptions);
        if(checkBoolean){
            UICtrl.createQuestionList(quizCtrl.getQuestionLocalStorage);
        }
            
    });
    selectedDomItems.insertedQuestsWrapper.addEventListener('click',function(e){
       UICtrl.editQuestList(e, quizCtrl.getQuestionLocalStorage,UICtrl.addInputsDynamically,UICtrl.createQuestionList); 
    });
    
    selectedDomItems.questionClearBtn.addEventListener('click',function(){
        UICtrl.clearQuestList(quizCtrl.getQuestionLocalStorage);
    });
    UICtrl.displayQuestion(quizCtrl.getQuestionLocalStorage,quizCtrl.getQuizProgress);
})(quizController,UIController);