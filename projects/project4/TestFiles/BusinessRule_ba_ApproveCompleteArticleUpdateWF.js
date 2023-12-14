/*===== export metadata =====
{
  "contextId" : "nl-NL",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "ba_ApproveCompleteArticleUpdateWF",
  "type" : "BusinessAction",
  "setupGroups" : [ "brg_Actions" ],
  "name" : "Approve Complete Article in Update Workflow",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "prd_Article", "prd_BundleArticle", "prd_GiftBoxArticle", "prd_ProductFamily" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : true,
  "onApprove" : "Never",
  "dependencies" : [ ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessActionWithBinds",
  "binds" : [ {
    "contract" : "CurrentObjectBindContract",
    "alias" : "node",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "BusinessFunctionBindContract",
    "alias" : "bf_GetReferenceTargets",
    "parameterClass" : "com.stibo.core.domain.impl.businessrule.function.javascript.reference.BusinessFunctionReferenceImpl",
    "value" : "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<BusinessFunctionReference>\n  <BusinessFunction>bf_GetReferenceTargets</BusinessFunction>\n</BusinessFunctionReference>\n",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "ref_NutritionalInformation",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "ref_NutritionalInformation",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "ref_PackagingMaterialInformation",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "ref_PackagingMaterialInformation",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "ptp_PartnerArticle",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "ptp_PartnerArticle",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "ref_Awards",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "ref_Awards",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "ref_Brand",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "ref_Brand",
    "description" : null
  }, {
    "contract" : "BusinessActionBindContract",
    "alias" : "ba_PostEventToCOSMOSArt",
    "parameterClass" : "com.stibo.core.domain.impl.businessrule.FrontBusinessActionImpl",
    "value" : "ba_PostEventToCOSMOSArt",
    "description" : null
  }, {
    "contract" : "BusinessActionBindContract",
    "alias" : "ba_InitiateInEventProcPostArticleToCOSM",
    "parameterClass" : "com.stibo.core.domain.impl.businessrule.FrontBusinessActionImpl",
    "value" : "ba_InitiateInEventProcPostArticleToCOSM",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "ref_PartnerProductImage",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "ref_PartnerProductImage",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "ref_PrimarySourceImage",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "ref_PrimarySourceImage",
    "description" : null
  }, {
    "contract" : "CurrentWorkflowBindContract",
    "alias" : "workflow",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,bf_GetReferenceTargets,ref_NutritionalInformation,ref_PackagingMaterialInformation,ptp_PartnerArticle,ref_Awards,ref_Brand,ba_PostEventToCOSMOSArt,ba_InitiateInEventProcPostArticleToCOSM,ref_PartnerProductImage,ref_PrimarySourceImage,workflow) {
//Approve node and referenced objects
var nutrientInformationObjects = bf_GetReferenceTargets.evaluate({referenceSource: node, referenceType: ref_NutritionalInformation}).toArray();
for (var x in nutrientInformationObjects) {
	nutrientInformationObjects[x].approve();
}
var tradeItObjects = bf_GetReferenceTargets.evaluate({referenceSource: node, referenceType: ptp_PartnerArticle}).toArray();
for (var z in tradeItObjects) {
	tradeItObjects[z].approve();
}
var packagingMaterialObjects = bf_GetReferenceTargets.evaluate({referenceSource:node, referenceType: ref_PackagingMaterialInformation}).toArray();
if(packagingMaterialObjects){
	for (var a in packagingMaterialObjects) {
		packagingMaterialObjects[a].approve();
	}
}

var partnerProductImages = bf_GetReferenceTargets.evaluate({referenceSource:node, referenceType: ref_PartnerProductImage}).toArray();
if (partnerProductImages) {
	for (var b in partnerProductImages) {
		partnerProductImages[b].approve();
	}
}

var sourceImages = bf_GetReferenceTargets.evaluate({referenceSource:node, referenceType: ref_PrimarySourceImage}).toArray();
if (sourceImages) {
	for (var c in sourceImages) {
		sourceImages[c].approve();
	}
}

//Approve packaging units and referenced objects
var packagingUnits = node.getChildren().toArray();
for (var y in packagingUnits) {
	var packagingMaterialObjects = bf_GetReferenceTargets.evaluate({referenceSource: packagingUnits[y], referenceType: ref_PackagingMaterialInformation}).toArray();
	for (var a in packagingMaterialObjects) {
		packagingMaterialObjects[a].approve();
	}
	var tradeItemObjects = bf_GetReferenceTargets.evaluate({referenceSource: packagingUnits[y], referenceType: ptp_PartnerArticle}).toArray();
	for (var b in tradeItemObjects) {
		tradeItemObjects[b].approve();
	}
	packagingUnits[y].approve();
	//Post event to OIEP
	if (node.isInState("wf_CreateArticle", "EnrichmentParallel")) {
		var newGrapeVariety = node.getWorkflowInstance(workflow).getSimpleVariable("NewGrapeVariety");
		if (newGrapeVariety == "YES"){
			ba_InitiateInEventProcPostArticleToCOSM.execute(packagingUnits[y]);
		}else{
			if(!node.getObjectType().getID().equals("prd_Article")){
				ba_PostEventToCOSMOSArt.execute(node);
				}
			}
	}else {
		if(!node.getObjectType().getID().equals("prd_Article")){
			ba_PostEventToCOSMOSArt.execute(node);
		}
	}
}
var approvalStatus = node.getApprovalStatus();
if(approvalStatus != 'Completely Approved') {
	node.approve();
}

if (node.getObjectType().getID().equals("prd_BundleArticle")){
	ba_PostEventToCOSMOSArt.execute(node);
}

}