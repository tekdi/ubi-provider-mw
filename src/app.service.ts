import { HttpService } from "@nestjs/axios";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { lastValueFrom, map } from "rxjs";
import { components } from "types/schema";
import axios from "axios";
import { SwayamApiResponse } from "types/SwayamApiResponse";
import {
  selectItemMapper,
  flnCatalogGenerator,
  flnCatalogGeneratorV4,
  scholarshipCatalogGenerator,
  confirmItemMapper,
  selectItemMapperNew,
  confirmItemMapperNew,
} from "utils/generator";
import * as crypto from "crypto";
import { v4 as uuidv4 } from "uuid";

// getting course data
import * as fs from "fs";
import { HasuraService } from "./services/hasura/hasura.service";
import { AuthService } from "./auth/auth.service";
import { Console } from "console";
import { S3Service } from "./services/s3/s3.service";
const file = fs.readFileSync("./course.json", "utf8");
const courseData = JSON.parse(file);

@Injectable()
export class AppService {
  constructor(
    private readonly httpService: HttpService,
    private readonly hasuraService: HasuraService,
    private readonly authService: AuthService,
    private readonly s3Service: S3Service
  ) {}
  private base_url = process.env.BASE_URL;
  private strapi_base_url = process.env.PROVIDER_API_URL;

  getHello(): string {
    return "kahani-provider service is running!!";
  }

  async getCoursesFromFlnV3(body: {
    context: components["schemas"]["Context"];
    message: { intent: components["schemas"]["Intent"] };
  }) {
    console.log("body 26", JSON.stringify(body));

    const intent: any = body.message.intent;
    console.log("intent: ", intent);

    // destructuring the intent
    const provider = intent?.provider?.descriptor?.name;
    const query = intent?.item?.descriptor?.name;
    const tagGroup = intent?.item?.tags;
    console.log("tag group: ", tagGroup);
    console.log("tag group [0]: ", tagGroup[0]);

    const flattenedTags: any = {};
    if (tagGroup) {
      (tagGroup[0].list as any[])?.forEach((tag) => {
        flattenedTags[tag.name] = tag.value;
      });
    }
    console.log("flattened tags: ", flattenedTags);
    const domain = flattenedTags?.domain !== "" ? flattenedTags?.domain : null;
    const theme = flattenedTags?.theme !== "" ? flattenedTags?.theme : null;
    const goal = flattenedTags?.goal !== "" ? flattenedTags?.goal : null;
    const competency =
      flattenedTags?.competency !== "" ? flattenedTags?.competency : null;
    const language =
      flattenedTags?.language !== "" ? flattenedTags?.language : null;
    const contentType =
      flattenedTags?.contentType !== "" ? flattenedTags?.contentType : null;

    try {
      const resp = await lastValueFrom(
        this.httpService
          .get("https://onest-strapi.tekdinext.com/fln-contents", {
            //  .get('http://localhost:1337/api/fln-contents', {
            params: {
              language: language,
              domain: domain,
              themes: theme,
              goal: goal,
              competency: competency,
              contentType: contentType,
            },
          })
          .pipe(map((item) => item.data))
      );
      console.log("resp", resp);
      const flnResponse: any = resp;
      const catalog = flnCatalogGenerator(flnResponse, query);

      const courseData: any = {
        context: body.context,
        message: {
          catalog: catalog,
        },
      };
      console.log("courseData", courseData);
      console.log("courseData 86", JSON.stringify(courseData));
      return courseData;
    } catch (err) {
      console.log("err: ", err);
      throw new InternalServerErrorException(err);
    }
  }

  async getCoursesFromFlnV4(body: {
    context: components["schemas"]["Context"];
    message: { intent: components["schemas"]["Intent"] };
  }) {
    console.log("body 98", JSON.stringify(body));
    const intent: any = body.message.intent;
    console.log("intent: ", intent);

    // destructuring the intent
    const provider = intent?.provider?.descriptor?.name;
    const query = intent?.item?.descriptor?.name;
    const tagGroup = intent?.item?.tags;
    console.log("tag group: ", tagGroup);

    const flattenedTags: any = {};
    if (tagGroup) {
      (tagGroup[0].list as any[])?.forEach((tag) => {
        flattenedTags[tag.name] = tag.value;
      });
    }
    console.log("flattened tags: ", flattenedTags);
    const domain = flattenedTags?.domain !== "" ? flattenedTags?.domain : null;
    const theme = flattenedTags?.theme !== "" ? flattenedTags?.theme : null;
    const goal = flattenedTags?.goal !== "" ? flattenedTags?.goal : null;
    const competency =
      flattenedTags?.competency !== "" ? flattenedTags?.competency : null;
    const language =
      flattenedTags?.language !== "" ? flattenedTags?.language : null;
    const contentType =
      flattenedTags?.contentType !== "" ? flattenedTags?.contentType : null;

    console.log("language", language);

    try {
      const resp = await lastValueFrom(
        this.httpService
          .get("https://onest-strapi.tekdinext.com/api/fln-contents", {
            //  .get('http://localhost:1337/api/fln-contents', {
            params: {
              "filters[language][$eq]": language,
              "filters[domain][$eq]": domain,
              "filters[themes][$eq]": theme,
              "filters[goal][$eq]": goal,
              "filters[competency]": competency,
              "filters[contentType]": contentType,
            },
          })
          .pipe(map((item) => item.data.data))
      );
      console.log("resp", resp);
      const flnResponse: any = resp;
      const catalog = flnCatalogGeneratorV4(flnResponse, query);

      const courseData: any = {
        context: body.context,
        message: {
          catalog: catalog,
        },
      };
      console.log("courseData", courseData);
      console.log("courseData 158", JSON.stringify(courseData));
      return courseData;
    } catch (err) {
      console.log("err: ", err);
      throw new InternalServerErrorException(err);
    }
  }

  async getCoursesFromFln(body: {
    context: components["schemas"]["Context"];
    message: { intent: components["schemas"]["Intent"] };
  }) {
    console.log("body >> ", JSON.stringify(body));
    const intent: any = body.message.intent;
    console.log("intent >> ", intent);

    console.log("domain >> ", body.context.domain);
    const gender = intent?.fulfillment?.customer?.person?.gender;
    const name = intent?.item?.descriptor?.name;
    const iTags = intent?.item?.tags || [];
    const tags = iTags.map((tag: any) => {
      let obj = {};
      obj[tag.descriptor.code] = tag.list.map((item: any) => {
        return item.value;
      });
      return obj;
    });
    const iLocations = intent?.provider?.locations || [];
    const locations = iLocations.map((location: any) => {
      return location.city.name;
    });
    try {
      let flnResponse = (
        await this.hasuraService.findContent({ gender, name, locations, tags })
      ).data?.scholarship_content;

      console.log("flnResponse", flnResponse);

      let flnResponse1 = [
        {
          id: 15,
          name: "Protean - Female",
          description: null,
          createdAt: "2024-10-05T12:25:47.210Z",
          updatedAt: "2024-10-05T12:37:23.533Z",
          amount: 1000,
          applicationDeadline: "2024-10-31",
          provider_id: 4,
          provider: "Protean eGove Infra Ltd",
          additionalResources: "required",
          applicationForm: "filled",
          applicationProcessing: "test_abc",
          applicationSubmissionDate: "10-11-2024",
          category: "scholarship",
          contactInformation: "mobile no",
          creator: "amar",
          domain: "finance",
          duration: "3 month",
          eligibilityCriteria: "BE",
          keywords: "scholarship",
          noOfRecipients: "5",
          selectionCriteria: "Graduate",
          status: "eligible",
          termsAndConditions: "This is terms and condition for this",
        },
      ];

      const catalog = flnCatalogGenerator(flnResponse1, name);
      body.context.action = "on_search";
      const courseData: any = {
        context: body.context,
        message: {
          catalog: catalog,
        },
      };
      console.log("courseData 158", JSON.stringify(courseData));
      return courseData;
    } catch (error) {
      console.log("err: ", error);
      throw new InternalServerErrorException(error);
    }
  }

  async getCoursesFromFlnV2(body: {
    context: components["schemas"]["Context"];
    message: { intent: components["schemas"]["Intent"] };
  }) {
    console.log("body >> ", JSON.stringify(body));
    const intent: any = body.message.intent;
    console.log("intent >> ", intent);

    console.log("domain >> ", body.context.domain);
    const gender = intent?.fulfillment?.customer?.person?.gender;
    const name = intent?.item?.descriptor?.name;
    const iTags = intent?.item?.tags || [];
    const tags = iTags.map((tag: any) => {
      let obj = {};
      obj[tag.descriptor.code] = tag.list.map((item: any) => {
        return item.value;
      });
      return obj;
    });
    const iLocations = intent?.provider?.locations || [];
    const locations = iLocations.map((location: any) => {
      return location.city.name;
    });

    try {
      // Replace Hasura call with HTTP request to Strapi
      const response = await axios.get(
        `${this.strapi_base_url}/api/scholarships?filters[is_published][$eq]=true&populate[eligibility][populate]=*&populate[provider]=*&populate[financial_information][populate]=*&populate[sponsors]=*`
      );

      const flnResponse = response.data.data;

      // Use the mapping function to transform the response
      const mappedResponse = await this.mapFlnResponseToDesiredFormat(
        flnResponse
      );

      const catalog = flnCatalogGenerator(mappedResponse, name);
      body.context.action = "on_search";
      const courseData: any = {
        context: body.context,
        message: {
          catalog: catalog,
        },
      };

      return courseData;
    } catch (error) {
      console.log("err: ", error);
      throw new InternalServerErrorException(error);
    }
  }

  // async getCoursesFromFlnV2New(body: {
  //   context: components["schemas"]["Context"];
  //   message: { intent: components["schemas"]["Intent"] };
  // }) {
  //   console.log("body >> ", JSON.stringify(body));
  //   const intent: any = body.message.intent;
  //   console.log("intent >> ", intent);

  //   console.log("domain >> ", body.context.domain);
  //   const gender = intent?.fulfillment?.customer?.person?.gender;
  //   const name = intent?.item?.descriptor?.name;
  //   const iTags = intent?.item?.tags || [];
  //   const tags = iTags.map((tag: any) => {
  //     let obj = {};
  //     obj[tag.descriptor.code] = tag.list.map((item: any) => {
  //       return item.value;
  //     });
  //     return obj;
  //   });
  //   const iLocations = intent?.provider?.locations || [];
  //   const locations = iLocations.map((location: any) => {
  //     return location.city.name;
  //   });

  //   let searchPayload = {
  //     RequestInfo: {
  //       apiId: "benefits-services",
  //       ver: "1.0",
  //       ts: null,
  //       action: "_search",
  //       did: null,
  //       key: null,
  //       msgId: "search_with_criteria",
  //       authToken: "dfcca143-b5a6-4726-b5cd-c2c949cb0f2b",
  //       correlationId: null,
  //       userInfo: {
  //         id: "1",
  //         userName: null,
  //         name: null,
  //         type: null,
  //         mobileNumber: null,
  //         emailId: null,
  //         roles: null,
  //         uuid: "40dceade-992d-4a8f-8243-19dda76a4171",
  //       },
  //     },
  //     MdmsCriteria: {
  //       tenantId: "Benefits.Benefit1",
  //       moduleDetails: [
  //         {
  //           moduleName: "Benefits",
  //           masterDetails: [
  //             {
  //               name: "BenefitsTable",
  //               filter: "",
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //   };

  //   try {
  //     // Replace Hasura call with HTTP request to Strapi
  //     // const response = await axios.post(
  //     //   `http://localhost:8094/mdms-v2/v1/_search`,
  //     //   searchPayload
  //     // );

  //     const flnResponse = [
  //       {
  //         ResponseInfo: null,
  //         MdmsRes: {
  //           Benefits: {
  //             BenefitsTable: [
  //               {
  //                 BenefitID: "BEN-002",
  //                 auto_renew: true,
  //                 benefit_name: "Scholarship Benefit",
  //                 failed_student: false,
  //                 Application_end: "2024-12-31",
  //                 eligibility_age: 16,
  //                 benefit_provider: "Govt. of Punjab",
  //                 Application_start: "2024-01-01",
  //                 eligibility_caste: "OBC",
  //                 eligibility_class: "10th",
  //                 eligibility_marks: "60%",
  //                 eligibility_gender: "B",
  //                 eligibility_income: "2,50,000",
  //                 benefit_description: "Provides financial aid to students",
  //                 eligibility_subject: "Science",
  //                 beneficiary_count_max: 500,
  //                 eligibility_attendance: "75%",
  //                 eligibility_child_count: 2,
  //                 allow_with_other_benefit: true,
  //                 eligibility_student_type: "dayscholar",
  //                 eligibility_qualification: "10th Pass",
  //                 finance_parent_occupation: "Farmer",
  //               },
  //             ],
  //           },
  //         },
  //       },
  //     ];

  //     // Use the mapping function to transform the response
  //     const mappedResponse = await this.mapFlnResponseToDesiredFormatNew(
  //       flnResponse
  //     );

  //     const catalog = flnCatalogGenerator(mappedResponse, name);
  //     body.context.action = "on_search";
  //     const courseData: any = {
  //       context: body.context,
  //       message: {
  //         catalog: catalog,
  //       },
  //     };

  //     return courseData;
  //   } catch (error) {
  //     console.log("err: ", error);
  //     throw new InternalServerErrorException(error);
  //   }
  // }

  mapFlnResponseToDesiredFormat(flnResponse: any[]): any[] {
    return flnResponse.map((item: any) => ({
      id: item?.id.toString(),
      documentId: item?.documentId,
      name: item?.name,
      description: item?.description || "N/A",
      long_description: item?.long_description || "N/A",
      gender: item?.eligibility?.gender || "N/A",
      min_qualification: item?.eligibility?.min_qualification || "NA",
      annual_income: item?.eligibility?.annual_income || "NA",
      disability: item?.eligibility?.disability || "NA",
      student_type: item?.eligibility?.student_type || "NA",
      age: item?.eligibility?.age || "NA",
      eligible_children_limit:
        item?.eligibility?.eligible_children_limit || "NA",
      domicile: item?.eligibility?.domicile || "NA",
      caste:
        item?.eligibility?.caste?.map((c: any) => c?.caste_name).join(", ") ||
        "N/A", // Join caste names into a single string
      class:
        item?.eligibility?.class?.map((c: any) => c?.class).join(", ") || "N/A", // Join caste names into a single string
      currency: item?.currency || "INR",
      createdAt: item?.createdAt,
      updatedAt: item?.updatedAt,
      amount: item?.price?.toString() || "1000", // Assuming 'price' represents the amount
      applicationDeadline: item?.application_deadline,
      extendedDeadline: item?.extended_deadline || null,
      providerId: item?.provider?.id || null,
      providerName: item?.provider?.username || null,
      providerEmail: item?.provider?.email || "N/A",
      additionalResources: "required", // Static value as per original example
      applicationForm: "filled", // Static value as per original example
      applicationProcessing: "test_abc", // Static value as per original example
      applicationSubmissionDate: item?.extended_deadline || null,
      category: "scholarship", // Static value as per original example
      contactInformation: item?.provider?.email || "N/A",
      creator: item?.provider?.username || "Unknown",
      domain: "finance", // Static value as per original example
      duration: "3 month", // Static value as per original example
      eligibilityCriteria: item?.eligibility?.min_qualification || "N/A",
      keywords: "scholarship", // Static value as per original example
      noOfRecipients: item?.financial_information?.max_bebeficiary || "N/A",
      eligibility: item?.eligibility,
      financialAmounts:
        item?.financial_information?.amt_per_beneficiary?.map((b: any) => ({
          caste: b?.caste,
          amount: b?.amount,
        })) || [], // Map over amt_per_beneficiary for caste and amount
      sponsors:
        item?.sponsors?.map((sponsor: any) => ({
          name: sponsor?.sponsor_name,
          entityType: sponsor?.entity_type,
          sharePercent: sponsor?.share_percent,
        })) || [], // Map over sponsors
      selectionCriteria: item?.eligibility?.student_type || "N/A",
      status: "eligible", // Static value as per original example
      termsAndConditions: "This is terms and condition for this", // Static value
    }));
  }

  // mapFlnResponseToDesiredFormatNew(flnResponse: any[]): any[] {
  //   return flnResponse
  //     .map((response: any) =>
  //       response?.MdmsRes?.Benefits?.BenefitsTable?.map((item: any) => ({
  //         id: item?.BenefitID || "N/A", // Mapping BenefitID to id
  //         documentId: null, // No equivalent field in the new response structure
  //         name: item?.benefit_name || "N/A", // benefit_name mapped to name
  //         description: item?.benefit_description || "N/A", // benefit_description mapped to description
  //         gender: item?.eligibility_gender || "N/A", // eligibility_gender mapped to gender
  //         min_qualification: item?.eligibility_qualification || "N/A", // eligibility_qualification mapped to min_qualification
  //         annual_income: item?.eligibility_income || "N/A", // eligibility_income mapped to annual_income
  //         disability: "N/A", // No equivalent field in the new structure
  //         student_type: item?.eligibility_student_type || "N/A", // eligibility_student_type mapped to student_type
  //         age: item?.eligibility_age || "N/A", // eligibility_age mapped to age
  //         eligible_children_limit: item?.eligibility_child_count || "N/A", // eligibility_child_count mapped to eligible_children_limit
  //         domicile: "N/A", // No equivalent field in the new structure
  //         caste: item?.eligibility_caste || "N/A", // eligibility_caste mapped to caste
  //         class: item?.eligibility_class || "N/A", // eligibility_class mapped to class
  //         currency: "INR", // Static value
  //         createdAt: null, // No equivalent field in the new structure
  //         updatedAt: null, // No equivalent field in the new structure
  //         amount: null, // No equivalent field in the new structure
  //         applicationDeadline: item?.Application_end || "N/A", // Application_end mapped to applicationDeadline
  //         extendedDeadline: null, // No equivalent field in the new structure
  //         providerId: null, // No equivalent field in the new structure
  //         providerName: item?.benefit_provider || "N/A", // benefit_provider mapped to providerName
  //         providerEmail: "N/A", // No equivalent field in the new structure
  //         additionalResources: "required", // Static value
  //         applicationForm: "filled", // Static value
  //         applicationProcessing: "test_abc", // Static value
  //         applicationSubmissionDate: item?.Application_end || null, // Using applicationDeadline value here
  //         category: "scholarship", // Static value
  //         contactInformation: "N/A", // No equivalent field in the new structure
  //         creator: item?.benefit_provider || "Unknown", // benefit_provider mapped to creator
  //         domain: "finance", // Static value
  //         duration: "3 month", // Static value
  //         eligibilityCriteria: item?.eligibility_qualification || "N/A", // eligibility_qualification mapped to eligibilityCriteria
  //         keywords: "scholarship", // Static value
  //         noOfRecipients: item?.beneficiary_count_max || "N/A", // beneficiary_count_max mapped to noOfRecipients
  //         eligibility: {
  //           caste: item?.eligibility_caste || "N/A",
  //           class: item?.eligibility_class || "N/A",
  //           income: item?.eligibility_income || "N/A",
  //           student_type: item?.eligibility_student_type || "N/A",
  //           gender: item?.eligibility_gender || "N/A",
  //           qualification: item?.eligibility_qualification || "N/A",
  //           age: item?.eligibility_age || "N/A",
  //         }, // eligibility object construction
  //         financialAmounts: [], // No equivalent data for amt_per_beneficiary in the new structure
  //         sponsors: [], // No equivalent field in the new structure
  //         selectionCriteria: item?.eligibility_student_type || "N/A", // eligibility_student_type mapped to selectionCriteria
  //         status: "eligible", // Static value
  //         termsAndConditions: "This is terms and condition for this", // Static value
  //       }))
  //     )
  //     .flat(); // Flatten the array since MdmsRes.Benefits.BenefitsTable is nested
  // }

  async handleSelect(selectDto: any) {
    console.log("select api calling", selectDto);
    // fine tune the order here
    const itemId = selectDto.message.order.items[0].id;
    const courseData = (await this.hasuraService.getFlnContentById(itemId)).data
      .scholarship_content;

    const provider: any = selectItemMapper(courseData);
    selectDto.message.order = { provider };
    selectDto.context.action = "on_select";
    const resp = selectDto;
    return resp;
  }

  async handleSelectV2(selectDto: any) {
    let response = [];
    console.log("select api calling", selectDto);
    // fine tune the order here
    const itemId = parseInt(selectDto.message.order.items[0].id);
    // const courseData = (await this.hasuraService.getFlnContentById(itemId)).data
    //   .scholarship_content;
    const courseData = await axios.get(
      `${this.strapi_base_url}/api/scholarships?filters[id][$eq]=${itemId}&populate[eligibility][populate]=*&populate[provider]=*&populate[financial_information][populate]=*&populate[sponsors]=*`
    );

    console.log("courseData---->>", courseData?.data?.data);

    response.push(courseData?.data?.data?.[0]);

    console.log("response-->>", response);

    // Use the mapping function to transform the response
    const mappedResponse = await this.mapFlnResponseToDesiredFormat(response);

    selectDto.message.order = selectItemMapperNew(mappedResponse);
    selectDto.context.action = "on_select";
    const resp = selectDto;
    return resp;
  }

  // async handleSelectV2New(selectDto: any) {
  //   let response = [];
  //   console.log("select api calling", selectDto);
  //   // fine tune the order here
  //   const itemId = parseInt(selectDto.message.order.items[0].id);
  //   // const courseData = (await this.hasuraService.getFlnContentById(itemId)).data
  //   //   .scholarship_content;
  //   let searchPayload = {
  //     RequestInfo: {
  //       apiId: "benefits-services",
  //       ver: "1.0",
  //       ts: null,
  //       action: "_search",
  //       did: null,
  //       key: null,
  //       msgId: "search_with_criteria",
  //       authToken: "dfcca143-b5a6-4726-b5cd-c2c949cb0f2b",
  //       correlationId: null,
  //       userInfo: {
  //         id: "1",
  //         userName: null,
  //         name: null,
  //         type: null,
  //         mobileNumber: null,
  //         emailId: null,
  //         roles: null,
  //         uuid: "40dceade-992d-4a8f-8243-19dda76a4171",
  //       },
  //     },
  //     MdmsCriteria: {
  //       tenantId: "Benefits.Benefit1",
  //       moduleDetails: [
  //         {
  //           moduleName: "Benefits",
  //           masterDetails: [
  //             {
  //               name: "BenefitsTable",
  //               filter: `${itemId}`,
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //   };

  //   // Replace Hasura call with HTTP request to Strapi
  //   // const response = await axios.post(
  //   //   `http://localhost:8094/mdms-v2/v1/_search`,
  //   //   searchPayload
  //   // );

  //   const flnResponse = [
  //     {
  //       ResponseInfo: null,
  //       MdmsRes: {
  //         Benefits: {
  //           BenefitsTable: [
  //             {
  //               BenefitID: "BEN-002",
  //               auto_renew: true,
  //               benefit_name: "Scholarship Benefit",
  //               failed_student: false,
  //               Application_end: "2024-12-31",
  //               eligibility_age: 16,
  //               benefit_provider: "Govt. of Punjab",
  //               Application_start: "2024-01-01",
  //               eligibility_caste: "OBC",
  //               eligibility_class: "10th",
  //               eligibility_marks: "60%",
  //               eligibility_gender: "B",
  //               eligibility_income: "2,50,000",
  //               benefit_description: "Provides financial aid to students",
  //               eligibility_subject: "Science",
  //               beneficiary_count_max: 500,
  //               eligibility_attendance: "75%",
  //               eligibility_child_count: 2,
  //               allow_with_other_benefit: true,
  //               eligibility_student_type: "dayscholar",
  //               eligibility_qualification: "10th Pass",
  //               finance_parent_occupation: "Farmer",
  //             },
  //           ],
  //         },
  //       },
  //     },
  //   ];

  //   // Use the mapping function to transform the response
  //   const mappedResponse = await this.mapFlnResponseToDesiredFormatNew(
  //     flnResponse
  //   );

  //   const provider: any = selectItemMapper(mappedResponse);
  //   selectDto.message.order = { provider };
  //   selectDto.context.action = "on_select";
  //   const resp = selectDto;
  //   return resp;
  // }

  async handleStatus(selectDto: any) {
    console.log("select api calling", selectDto);
    // fine tune the order here
    const itemId = selectDto.message.order_id;
    const customer = (await this.hasuraService.getCustomerById(itemId)).data
      .scholarship_customer_details[0];
    const status = {
      billing: (({ name, phone, email }) => ({ name, phone, email }))(customer),
      payments: [
        {
          params: {
            amount: (Math.floor(Math.random() * 20) * 10).toString(),
            currency: "INR",
          },
          type: "PRE-ORDER",
          status: "PAID",
          collected_by: "bpp",
        },
      ],
    };

    const courseData = (
      await this.hasuraService.getFlnContentById(customer.content_id)
    ).data.scholarship_content;
    const { id, descriptor, categories, locations, items, rateable }: any =
      selectItemMapper(courseData);
    selectDto.message = {
      order: {
        id: itemId,
        provider: { id, descriptor, rateable, locations, categories },
        items,
        ...status,
      },
    };
    selectDto.context.action = "on_status";
    const resp = selectDto;
    return resp;
  }

  async handleStatusV2(selectDto: any) {
    console.log("select api calling", selectDto);
    // fine tune the order here
    const itemId = selectDto.message.order_id;
    const customer = (await this.hasuraService.getCustomerById(itemId)).data
      .scholarship_customer_details[0];
    const status = {
      billing: (({ name, phone, email }) => ({ name, phone, email }))(customer),
      payments: [
        {
          params: {
            amount: (Math.floor(Math.random() * 20) * 10).toString(),
            currency: "INR",
          },
          type: "PRE-ORDER",
          status: "PAID",
          collected_by: "bpp",
        },
      ],
    };

    const courseData = (
      await this.hasuraService.getFlnContentById(customer.content_id)
    ).data.scholarship_content;
    const { id, descriptor, categories, locations, items, rateable }: any =
      selectItemMapper(courseData);
    selectDto.message = {
      order: {
        id: itemId,
        provider: { id, descriptor, rateable, locations, categories },
        items,
        ...status,
      },
    };
    selectDto.context.action = "on_status";
    const resp = selectDto;
    return resp;
  }

  async handleInit(selectDto: any) {
    const itemId = selectDto.message.order.items[0].id;
    const courseData = (await this.hasuraService.getFlnContentById(itemId)).data
      .scholarship_content;
    const xinput = {
      head: {
        descriptor: {
          name: "Application Form",
        },
        index: {
          min: 0,
          cur: 0,
          max: 1,
        },
        headings: ["Personal Details"],
      },
      form: {
        url: `${this.base_url}/application/${itemId}/${selectDto.context.transaction_id}`,
        mime_type: "text/html",
        resubmit: false,
      },
      required: true,
    };
    const { id, descriptor, categories, locations, items, rateable }: any =
      selectItemMapper(courseData);
    items[0].xinput = xinput;
    selectDto.message.order = {
      ...selectDto.message.order,
      provider: { id, descriptor, rateable, locations, categories },
      items,
    };
    selectDto.context.action = "on_init";
    const resp = selectDto;
    console.log("resp", resp);
    return resp;
  }

  async handleInitV2(selectDto: any) {
    let response = [];
    const itemId = parseInt(selectDto.message.order.items[0].id);
    const courseData = await axios.get(
      `${this.strapi_base_url}/api/scholarships?filters[id][$eq]=${itemId}&populate[eligibility][populate]=*&populate[provider]=*&populate[financial_information][populate]=*&populate[sponsors]=*`
    );

    response.push(courseData?.data?.data?.[0]);

    // Use the mapping function to transform the response
    const mappedResponse = await this.mapFlnResponseToDesiredFormat(response);

    const xinput = {
      head: {
        descriptor: {
          name: "Application Form",
        },
        index: {
          min: 0,
          cur: 0,
          max: 1,
        },
        headings: ["Personal Details"],
      },
      form: {
        url: `${this.base_url}/application/${itemId}/${selectDto.context.transaction_id}`,
        mime_type: "text/html",
        resubmit: false,
      },
      required: true,
    };
    const { id, descriptor, categories, locations, items, rateable }: any =
      selectItemMapper(mappedResponse);
    items[0].xinput = xinput;
    selectDto.message.order = {
      ...selectDto.message.order,
      provider: { id, descriptor, rateable, locations, categories },
      items,
    };
    selectDto.context.action = "on_init";
    const resp = selectDto;
    console.log("resp", resp);
    return resp;
  }

  async handleConfirm(confirmDto: any) {
    const customer =
      confirmDto.message.order.fulfillments[0].agent ||
      confirmDto.message.order.fulfillments[0].customer;
    const submission_id =
      confirmDto.message.order.items[0].xinput.form.submission_id;
    const itemId = confirmDto.message.order.items[0].id;
    console.log("customer", customer);
    console.log("submission_id", submission_id);
    console.log("itemId", itemId);
    const courseData = (await this.hasuraService.getFlnContentById(itemId)).data
      .scholarship_content;
    const { id, descriptor, categories, locations, items, rateable }: any =
      selectItemMapper(courseData);
    const order_id: string = "TLEXP_" + this.generateRandomString();
    const orderDetails = await this.hasuraService.updateCustomerDetails(
      order_id,
      itemId,
      submission_id
    );
    console.log(orderDetails);
    items[0].xinput = {
      head: {
        descriptor: { name: "Application Form" },
        index: { min: 0, cur: 1, max: 1 },
      },
      form: {
        data: orderDetails.data.update_scholarship_customer_details
          .returning[0],
        submission_id:
          orderDetails.data.update_scholarship_customer_details.returning[0]
            .submission_id,
      },
      required: true,
    };
    const order: any = {
      id: order_id,
      ...confirmDto.message.order,
      provider: { id, descriptor, rateable, locations, categories },
      items,
    };
    order["state"] = "COMPLETE";
    order["updated_at"] = new Date(Date.now());
    order["fulfillments"] = [
      {
        agent: {
          person: {
            name: customer?.person?.name ? customer.person.name : "",
          },
          contact: {
            phone: customer?.contact?.phone ? customer.contact.phone : "",
            email: customer?.contact?.email ? customer.contact.email : "",
          },
        },
      },
    ];
    confirmDto.message.order = order;
    confirmDto.context.action = "on_confirm";

    return confirmDto;
  }

  async handleConfirmV2(confirmDto: any) {
    let response = [];
    const customer =
      confirmDto.message.order.fulfillments[0].agent ||
      confirmDto.message.order.fulfillments[0].customer;
    const submission_id =
      confirmDto.message.order.items[0].xinput.form.submission_id;
    const itemId = parseInt(confirmDto?.message?.order?.items[0]?.id);

    const courseData = await axios.get(
      `${this.strapi_base_url}/api/scholarships?filters[id][$eq]=${itemId}&populate[eligibility][populate]=*&populate[provider]=*&populate[financial_information][populate]=*&populate[sponsors]=*`
    );

    console.log("courseData-->>", courseData?.data?.data?.[0]);
    response.push(courseData?.data?.data?.[0]);

    // Use the mapping function to transform the response
    const mappedResponse = await this.mapFlnResponseToDesiredFormat(response);

    console.log("mappedResonse-->>", mappedResponse);

    const order_id: string = "TLEXP_" + this.generateRandomString();
    mappedResponse[0].order_id = order_id;

    // get customer details based on submission id and content id

    const customerData = await axios.get(
      `${this.strapi_base_url}/api/applications?filters[$and][0][submission_id][$eq]=${submission_id}`
    );

    console.log("customerData-->>", customerData?.data?.data);
    // get document id from customerData

    let document_id = customerData?.data?.data?.[0]?.documentId;

    console.log("orderid--->>", order_id);

    //update customer details payload

    const updateCustomerPayload = {
      data: {
        first_name: customerData?.data?.data?.[0]?.first_name || "NA",
        last_name: customerData?.data?.data?.[0]?.last_name || "NA",
        father_name: customerData?.data?.data?.[0]?.father_name || "NA",
        samagra_id: customerData?.data?.data?.[0]?.samagra_id || "NA",
        class: customerData?.data?.data?.[0]?.class || 0,
        resident_type: customerData?.data?.data?.[0]?.resident_type || "NA",
        aadhaar: customerData?.data?.data?.[0]?.aadhaar || "NA",
        marks_previous_class:
          customerData?.data?.data?.[0]?.marks_previous_class || 0,
        caste: customerData?.data?.data?.[0]?.caste || "NA",
        application_status:
          customerData?.data?.data?.[0]?.application_status || "NA",
        current_school_name:
          customerData?.data?.data?.[0]?.current_school_name || "NA",
        current_school_address:
          customerData?.data?.data?.[0]?.current_school_address || "NA",
        application_date: customerData?.data?.data?.[0]?.application_date,
        phone: customerData?.data?.data?.[0]?.phone || "NA",
        gender: customerData?.data?.data?.[0]?.gender || "NA",
        order_id: order_id || 0,
        transaction_id: customerData?.data?.data?.[0]?.transaction_id || "NA",
        submission_id: customerData?.data?.data?.[0]?.submission_id || "NA",
        content_id: customerData?.data?.data?.[0]?.content_id || "NA",
      },
    };

    console.log("updateCustomerPayload--->>", updateCustomerPayload);

    console.log(
      "urlll--->>>",

      `${this.strapi_base_url}/api/applications/${document_id}`,
      updateCustomerPayload
    );

    // Axios POST call
    const orderDetails = await axios.put(
      `${this.strapi_base_url}/api/applications/${document_id}`,
      updateCustomerPayload
    );

    let order = confirmItemMapperNew(mappedResponse);

    order["state"] = "COMPLETE";
    order["updated_at"] = new Date(Date.now());

    console.log("order--->>", order);

    confirmDto.message = order;
    confirmDto.context.action = "on_confirm";
    console.log("confirmDto", confirmDto);
    return confirmDto;
  }

  generateRandomString() {
    let generatedNumbers = [];

    function generateUniqueRandomNumber() {
      let randomNumber;
      do {
        randomNumber = Math.floor(10000000 + Math.random() * 90000000);
      } while (generatedNumbers.includes(randomNumber));

      generatedNumbers.push(randomNumber);
      return randomNumber;
    }

    console.log(generateUniqueRandomNumber());
    return generateUniqueRandomNumber();
  }

  async handleInitSubmit(id: string, transaction_id: string, body: any) {
    console.log("body-->>", body);
    try {
      const submission_id = uuidv4();
      const customer = await this.hasuraService.addCustomerDetails(
        id,
        body,
        submission_id,
        transaction_id
      );
      if (customer.errors) throw customer.errors;
      console.log(
        "form data submitted >> ",
        customer.data.insert_scholarship_customer_details.returning[0]
      );
      return customer.data.insert_scholarship_customer_details.returning[0]
        .submission_id;
    } catch (error) {
      return error;
    }
  }

  async handleInitSubmitV2(id: any, transaction_id: string, body: any) {
    try {
      const submission_id = uuidv4();
      const date = new Date();
      const formattedDate = date.toISOString().split("T")[0];

      // Prepare the payload for the POST request
      const payload = {
        data: {
          first_name: body?.first_name || "NA",
          last_name: body?.last_name || "NA",
          father_name: body?.father_name || "NA",
          samagra_id: body?.samagra_id || "NA",
          class: body?.class || 0,
          resident_type: body?.resident_type || "NA",
          aadhaar: body?.aadhaar || "NA",
          marks_previous_class: body?.marks_previous_class || 0,
          caste: body?.caste || "NA",
          current_school_name: body?.current_school_name || "NA",
          current_school_address: body?.current_school_address || "NA",
          application_date: formattedDate,
          phone: body?.phone || "NA",
          gender: body?.gender || "NA",
          order_id: body?.order_id || "NA",
          transaction_id: transaction_id || "NA",
          submission_id: submission_id || "NA",
          content_id: parseInt(id) || 0, // Assuming content_id is a number
        },
      };

      console.log("payload-->>", payload);

      // Axios POST call
      const response = await axios.post(
        `${this.strapi_base_url}/api/applications`,
        payload
      );

      // Check for errors
      if (response.data.errors) throw response.data.errors;

      console.log("form data submitted >> ", response.data);

      // Return the submission_id
      return response.data.data.submission_id;
    } catch (error) {
      console.error("Error submitting form: ", error);
      return error;
    }
  }

  async handleRating(ratingDto: any) {
    const itemId = ratingDto.message.ratings[0].id;
    const rating = ratingDto.message.ratings[0].value;
    const feedback = ratingDto.message.ratings[0].feedback;

    const courseData = await this.hasuraService.rateFlnContentById(
      itemId,
      rating,
      feedback
    );
    const id = courseData.data.insert_Ratings.returning[0].id;

    ratingDto.context.action = "on_rating";
    ratingDto.message = {
      feedback_form: {
        form: {
          url: `${this.base_url}/feedback/${id}`,
          mime_type: "text/html",
        },
        required: true,
      },
    };
    const resp = ratingDto;
    return resp;
  }

  async handleSubmit(description, id) {
    try {
      const courseData = await this.hasuraService.SubmitFeedback(
        description,
        id
      );
      return { message: "feedback submitted Successfully" };
    } catch (error) {
      return error;
    }
  }

  // Function to check if a string is a valid URL
  isValidUrl(str: string) {
    try {
      new URL(str);
      return true;
    } catch (error) {
      return false;
    }
  }
}
