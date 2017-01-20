const pkg = require('../../../package.json');

const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('v3DataParser', [
    '$injector',
    function($injector){
        let findInIncludes;

        function includedGenerator(included = []) {
            return data => {
                return included.find( element => {
                    return (element.type === data.type && element.id === data.id);
                });
            };
        }

        function createArrayModels(data) {
            let dataModels = [];

            if (data.length) {
                dataModels = data.map(createObjectModel);
            }

            return dataModels;
        }

        function createObjectModel(data = {}){
            let objectModel = angular.copy(data);
            let relationships = objectModel.relationships;

            return createRelationships(objectModel, relationships);
        }

        function createRelationships(data, relationships){
            let linkageProperty;
            let includedDataArray = [];
            let includedDataObj = {};
            let includedExtend = {};

            for(let rel in relationships){
                if(relationships.hasOwnProperty(rel)){
                    linkageProperty = relationships[rel]['data'];
                }
                if(linkageProperty){
                    if(Array.isArray(linkageProperty)){
                        includedDataArray = constructArrayFromIncluded(linkageProperty, findInIncludes);
                        if(includedDataArray.length){
                            includedExtend[rel] = includedDataArray;
                        }
                    }else{
                        //single object
                        includedDataObj = constructObjFromIncluded(linkageProperty, findInIncludes);
                        if(includedDataObj){
                            includedExtend[rel] = includedDataObj;
                        }
                    }
                }
            }

            data.includedExtend = includedExtend;

            return data;
        }

        function constructArrayFromIncluded(linkageProperty, included){
            let includedDataArray = [], dataObj = {};

            angular.forEach(linkageProperty, linkageProp =>{
                dataObj = constructObjFromIncluded(linkageProp, included);

                if(dataObj){
                    if(dataObj.relationships){
                        dataObj = createRelationships(dataObj, dataObj.relationships);
                    }
                    includedDataArray.push(dataObj);
                }
            });

            return includedDataArray;
        }

        function constructObjFromIncluded(linkageProperty, included){
            let dataObj = {};
            dataObj = included(linkageProperty);

            if(dataObj && dataObj.relationships){
                dataObj = createRelationships(dataObj, dataObj.relationships, included);
            }

            return dataObj;
        }

        const v3DataParser = {

            parseData(apiData){
                let data = angular.copy(apiData.data);
                let included = apiData.included ? apiData.included : [];

                findInIncludes = includedGenerator(included);

                if(Array.isArray(data)){
                    return createArrayModels(data);
                }else{
                    return createObjectModel(data);
                }
            },

            constructFactoryFromString(str){
                let arr = str.split('-');
                let updatedArr =  arr.map(item => {
                    return item.replace(/(^| )(\w)/g, function(x) {
                        return x.toUpperCase();
                    });
                });
                return 'v3'+updatedArr.join('')+'Factory';
            }

        };

        return v3DataParser;
    }
]);
