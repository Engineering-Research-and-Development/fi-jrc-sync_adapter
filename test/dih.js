exports.DymerEntities = [
    {   
        "id": "1",
        "type": "DigitalInnovationHub",
        "title":{
           "type":"Property",
           "value": "Test_1"
        },
        "website":{
           "type":"Property",
           "value": "www.test.it"
        },
        "logo":{
           "type":"Property",
           "value":{
              "base64Data": "",
              "fileName": ""
           }
        },
        "description":{
           "type":"Property",
           "value": "there is a description"
        },
        "address":{
           "type":"Property",
           "value":{
                 "streetAddress": "test",
                 "addressRegion": "",
                 "postalCode": "",
                 "addressCountry": "test",
                 "addressLocality": "test"          
              }
        },
        "representatives":{
           "type":"Property",
           "value":[
              {
                
                 "name": "test",
                 "surname": "test",
                 "email": "test",
                 "role": "test",
                 "responsibilities": "test"
              }
           ]
        },
        
        "domain":{
           "type": "Property",
           "value": "test"
        },
        "competences": {
             "type": "Property",
             "value": [
                 ""
             ]
         },
        "socialAccounts": {
             "type": "Property",
             "value": {
                 "linkedin": "",
                 "facebook": "",
                 "twitter": "",
                 "instagram": ""
             }
         },
        "relation": {
             "type": "Property",
             "value": [
                 {
                     "relationType": "dih",
                     "relationIdentifier": ""
                 },
                 {
                     "relationType": "service",
                     "relationIdentifier": ""
                 }
             ]
         },
        "lastUpdate": {
           "type": "Property",
           "value": "25/01 Jan 1970 00:00:00 GMT"
        },
        "location": {
           "type": "Property",
           "value": {
              "type": "<%= geometry.type %>",
              "coordinates": [6.044237825379717, 50.77619303165207]
           }
        }
     },
     {   
        "id": "urn:ngsi-ld:DigitalInnovationHub:s3jrc:4423_dymer",
        "type": "DigitalInnovationHub",
        "title":{
           "type":"Property",
           "value": "Aachen DIH Center for Robotics in Healthcare"
        },
        "website":{
           "type":"Property",
           "value": "http://www.robotics.ukaachen.de/"
        },
        "logo":{
           "type":"Property",
           "value":{
              "base64Data": "",
              "fileName": ""
           }
        },
        "description":{
           "type":"Property",
           "value": "The Center for Robotics in Healthcare is the central one-stop-shop for enterprises, researchers or clinicians, who would like to engage in the field of healthcare robotics and are looking for support and partners to develop innovative ideas into products. Serving as the main entry gate to the regional Digital Innovation Hub, the CRH connects interested parties with the right institutions within the extensive and deeply rooted technological network in Aachen and the EUREGIO region."
        },
        "address":{
           "type":"Property",
           "value":{
                 "streetAddress": "Pauwelsstrae 30",
                 "addressRegion": "",
                 "postalCode": "",
                 "addressCountry": "Germany",
                 "addressLocality": "Aachen"          
              }
        },
        "representatives":{
           "type":"Property",
           "value":[
              {
                
                 "name": "Rolf",
                 "surname": "Rossaint",
                 "email": "robotics@ukaachen.de",
                 "role": "med.",
                 "responsibilities": ""
              }
           ]
        },
        
        "domain":{
           "type": "Property",
           "value": "Life sciences & healthcare"
        },
        "competences": {
             "type": "Property",
             "value": [
                 ""
             ]
         },
        "socialAccounts": {
             "type": "Property",
             "value": {
                 "linkedin": "",
                 "facebook": "",
                 "twitter": "",
                 "instagram": ""
             }
         },
        "relation": {
             "type": "Property",
             "value": [
                 {
                     "relationType": "dih",
                     "relationIdentifier": ""
                 },
                 {
                     "relationType": "service",
                     "relationIdentifier": ""
                 }
             ]
         },
        "lastUpdate": {
           "type": "Property",
           "value": "2018-07-25T04:47:00.000Z"
        },
        "location": {
           "type": "Property",
           "value": {
              "type": "Point",
              "coordinates": [6.044238, 50.776193]
           }
        }
     }

]

exports.OrionEntities = [
    {
        "@context": "https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld",
        "id": "urn:ngsi-ld:DigitalInnovationHub:s3jrc:4423_orion",
        "type": "DigitalInnovationHub",
        "https://schema.org/address": {
            "type": "Property",
            "value": {
                "streetAddress": "Pauwelsstrae 30",
                "addressRegion": "",
                "postalCode": "",
                "addressCountry": "Germany",
                "addressLocality": "Aachen"
            }
        },
        "https://smartdatamodels.org/dataModel.DigitalInnovationHub/competences": {
            "type": "Property",
            "value": ""
        },
        "https://smartdatamodels.org/dataModel.DigitalInnovationHub/domain": {
            "type": "Property",
            "value": "Life sciences & healthcare"
        },
        "https://smartdatamodels.org/dataModel.DigitalInnovationHub/logo": {
            "type": "Property",
            "value": {
                "base64Data": "",
                "fileName": ""
            }
        },
        "https://smartdatamodels.org/dataModel.DigitalInnovationHub/relation": {
            "type": "Property",
            "value": [
                {
                    "relationType": "dih",
                    "relationIdentifier": ""
                },
                {
                    "relationType": "service",
                    "relationIdentifier": ""
                }
            ]
        },
        "https://smartdatamodels.org/dataModel.DigitalInnovationHub/representatives": {
            "type": "Property",
            "value": {
                "name": "Rolf",
                "surname": "Rossaint",
                "email": "robotics@ukaachen.de",
                "role": "med.",
                "responsibilities": ""
            }
        },
        "https://smartdatamodels.org/dataModel.DigitalInnovationHub/socialAccounts": {
            "type": "Property",
            "value": {
                "linkedin": "",
                "facebook": "",
                "twitter": "",
                "instagram": ""
            }
        },
        "https://smartdatamodels.org/dataModel.DigitalInnovationHub/website": {
            "type": "Property",
            "value": "http://www.robotics.ukaachen.de/"
        },
        "lastUpdate": {
            "type": "Property",
            "value": "2018-07-25T04:47:00.000Z"
        },
        "description": {
            "type": "Property",
            "value": "The Center for Robotics in Healthcare is the central one-stop-shop for enterprises, researchers or clinicians, who would like to engage in the field of healthcare robotics and are looking for support and partners to develop innovative ideas into products. Serving as the main entry gate to the regional Digital Innovation Hub, the CRH connects interested parties with the right institutions within the extensive and deeply rooted technological network in Aachen and the EUREGIO region."
        },
        "title": {
            "type": "Property",
            "value": "Aachen DIH Center for Robotics in Healthcare"
        },
        "location": {
            "type": "Property",
            "value": {
                "type": "Point",
                "coordinates": [
                    6.044238,
                    50.776193
                ]
            }
        }
    },
    {
        "@context": "https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld",
        "id": "urn:ngsi-ld:DigitalInnovationHub:s3jrc:1063",
        "type": "DigitalInnovationHub",
        "https://schema.org/address": {
            "type": "Property",
            "value": {
                "streetAddress": "Beethovenstrae, 1",
                "addressRegion": "",
                "postalCode": "",
                "addressCountry": "Germany",
                "addressLocality": "Aalen"
            }
        },
        "https://smartdatamodels.org/dataModel.DigitalInnovationHub/competences": {
            "type": "Property",
            "value": ""
        },
        "https://smartdatamodels.org/dataModel.DigitalInnovationHub/domain": {
            "type": "Property",
            "value": [
                "Manufacture of other non-metallic mineral products",
                "Manufacture of basic metals and fabricated metal products",
                "Manufacture of machinery and equipment",
                "Manufacture of electrical and optical equipment",
                "Manufacture of transport equipment"
            ]
        },
        "https://smartdatamodels.org/dataModel.DigitalInnovationHub/logo": {
            "type": "Property",
            "value": {
                "base64Data": "",
                "fileName": ""
            }
        },
        "https://smartdatamodels.org/dataModel.DigitalInnovationHub/relation": {
            "type": "Property",
            "value": [
                {
                    "relationType": "dih",
                    "relationIdentifier": ""
                },
                {
                    "relationType": "service",
                    "relationIdentifier": ""
                }
            ]
        },
        "https://smartdatamodels.org/dataModel.DigitalInnovationHub/representatives": {
            "type": "Property",
            "value": {
                "name": "Axel",
                "surname": "Zimmerman",
                "email": "Axel.Zimmermann@hs-aalen.de",
                "role": "Dr.",
                "responsibilities": ""
            }
        },
        "https://smartdatamodels.org/dataModel.DigitalInnovationHub/socialAccounts": {
            "type": "Property",
            "value": {
                "linkedin": "",
                "facebook": "",
                "twitter": "",
                "instagram": ""
            }
        },
        "https://smartdatamodels.org/dataModel.DigitalInnovationHub/website": {
            "type": "Property",
            "value": "http://www.hs-aalen.de/"
        },
        "lastUpdate": {
            "type": "Property",
            "value": "2018-09-01T07:47:00.000Z"
        },
        "description": {
            "type": "Property",
            "value": "The I 4.0 test beds are a central aspect inside the advancement. They support SMEs to test their new I 4.0 products and components as well as the appendant digital process and linked business models under real conditions."
        },
        "title": {
            "type": "Property",
            "value": "Aalen University / Transfer Platform Industry 4.0"
        },
        "location": {
            "type": "Property",
            "value": {
                "type": "Point",
                "coordinates": [
                    10.073462,
                    48.838046
                ]
            }
        }
    }
  
]