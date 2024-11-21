import { HttpService } from "@nestjs/axios";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { lastValueFrom, map } from "rxjs";
import { components } from "types/schema";
import axios from "axios";
import fetch from "node-fetch";
// Import node-fetch in Node.js
const fetch = require("node-fetch");

import FormData from "form-data";

const path = require("path");

import {
  selectItemMapper,
  flnCatalogGenerator,
  flnCatalogGeneratorV4,
  selectItemMapperNew,
  confirmItemMapperNew,
} from "utils/generator";

import { v4 as uuidv4 } from "uuid";

// getting course data
import * as fs from "fs";
import { HasuraService } from "./services/hasura/hasura.service";
import { AuthService } from "./auth/auth.service";
import { S3Service } from "./services/s3/s3.service";
const file = fs.readFileSync("./course.json", "utf8");
const courseData = JSON.parse(file);
import benefitSchema from "../utils/benefit-schema.json";

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

  //beneficiary schema interface

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
    const intent: any = body.message.intent;

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
      const response = await axios.post(
        `${this.strapi_base_url}/benefits/v1/_getAll`
      );

      // const flnResponse = response.data;
      const flnResponse = response.data;

      // Use the mapping function to transform the response
      const mappedResponse = await this.mapFlnResponseToDesiredFormat(
        flnResponse
      );

      console.log("mappedResponse-->>", mappedResponse);

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

  mapFlnResponseToDesiredFormat(flnResponse: any[]): any[] {
    return flnResponse
      .filter(
        (response) => response.schema !== null && response.schema !== undefined
      ) // Filter out invalid schemas
      .map((response) => {
        // Parse the schema JSON if it exists and is a string
        let en;
        try {
          // Replace any escaped backslashes and parse JSON
          const cleanedSchema = response.schema.replace(/\\/g, "");
          en = JSON.parse(cleanedSchema).en || {};
        } catch (error) {
          console.error("Error parsing schema JSON:", error);
        }

        // Extract directly from the parsed/en object
        const basicDetails = en.basicDetails || {};
        const benefitContent = en.benefitContent || {};
        const providingEntity = en.providingEntity || {};
        const sponsoringEntities = en.sponsoringEntities || [];
        const eligibility = en.eligibility || [];
        const documents = en.documents || [];

        // Map each response to the desired structure
        return {
          basicDetails, // Return the basicDetails object directly
          benefitContent, // Return the benefitContent object directly
          providingEntity, // Return the providingEntity object directly
          sponsoringEntities, // Return the sponsoringEntities array directly
          eligibility, // Return the eligibility array directly
          documents, // Return the documents array directly
          provider_id: response.benefitId, // Extract provider name if available
        };
      });
  }

  // mapFlnResponseToDesiredFormat(flnResponse: any[]): any[] {
  //   return flnResponse.map((response) => {
  //     // Extract directly from the response
  //     const en = response.en || {};
  //     const basicDetails = en.basicDetails || {};
  //     const benefitContent = en.benefitContent || {};
  //     const providingEntity = en.providingEntity || {};
  //     const sponsoringEntities = en.sponsoringEntities || [];
  //     const eligibility = en.eligibility || [];
  //     const documents = en.documents || [];

  //     // Map each response to the desired structure
  //     return {
  //       basicDetails, // Return the basicDetails object directly
  //       benefitContent, // Return the benefitContent object directly
  //       providingEntity, // Return the providingEntity object directly
  //       sponsoringEntities, // Return the sponsoringEntities array directly
  //       eligibility, // Return the eligibility array directly
  //       documents, // Return the documents array directly
  //       provider_id: response.provider_id, // Extract provider name if available
  //       // Include benefitId in the output
  //     };
  //   });
  // }

  // mapFlnResponseToDesiredFormat(flnResponse: any): any[] {
  //   const en = flnResponse.en || {};
  //   const basicDetails = en.basicDetails || {};
  //   const benefitContent = en.benefitContent || {};
  //   const providingEntity = en.providingEntity || {};
  //   const sponsoringEntities = en.sponsoringEntities || [];
  //   const eligibility = en.eligibility || [];
  //   const documents = en.documents || [];
  //   const applicationProcess = en.applicationProcess || {};
  //   const applicationForm = en.applicationForm || [];

  //   // Map to array structure expected by flnCatalogGenerator
  //   return [
  //     {
  //       basicDetails,
  //       benefitContent,
  //       providingEntity,
  //       sponsoringEntities,
  //       eligibility,
  //       documents,
  //       applicationProcess,
  //       applicationForm,
  //       provider_id: providingEntity.name || "Unknown", // Mocking a provider_id field
  //     },
  //   ];
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
    const itemId = selectDto.message.order.items[0].id;
    // const courseData = (await this.hasuraService.getFlnContentById(itemId)).data
    //   .scholarship_content;
    // const courseData = await axios.get(
    //   `${this.strapi_base_url}/api/scholarships?filters[id][$eq]=${itemId}&populate[eligibility][populate]=*&populate[provider]=*&populate[financial_information][populate]=*&populate[sponsors]=*`
    // );

    // Digit api url
    const courseData = await axios.post(
      `${this.strapi_base_url}/benefits/v1/_get`,
      {
        benefitId: `${itemId}`,
      }
    );

    response.push(courseData.data);

    // Use the mapping function to transform the response
    const mappedResponse = await this.mapFlnResponseToDesiredFormat(response);

    console.log("mappedResponse-->>", mappedResponse);

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
    let ubi_provider_url =
      "https://dev-uba-provider.tekdinext.com/uba-ui/provider.com";
    let response = [];
    const itemId = selectDto.message.order.items[0].id;
    const courseData = await axios.post(
      `${this.strapi_base_url}/benefits/v1/_get`,
      {
        benefitId: `${itemId}`,
      }
    );

    response.push(courseData.data);

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
        url: `${ubi_provider_url}/${itemId}/apply`,
        mime_type: "text/html",
        resubmit: false,
      },
      required: true,
    };
    const { id, descriptor, categories, locations, items, rateable }: any =
      selectItemMapperNew(mappedResponse);
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
    const itemId = confirmDto?.message?.order?.items[0]?.id;

    const courseData = await axios.post(
      `${this.strapi_base_url}/benefits/v1/_get`,
      {
        benefitId: `${itemId}`,
      }
    );

    response.push(courseData.data);

    // Use the mapping function to transform the response
    const mappedResponse = await this.mapFlnResponseToDesiredFormat(response);
    // Use the mapping function to transform the response

    console.log("mappedResonse-->>", mappedResponse);

    const order_id: string = "TLEXP_" + this.generateRandomString();
    mappedResponse[0].order_id = order_id;

    // get customer details based on submission id and content id

    // const customerData = await axios.get(
    //   `${this.strapi_base_url}/api/applications?filters[$and][0][submission_id][$eq]=${submission_id}`
    // );

    // console.log("customerData-->>", customerData?.data?.data);
    // // get document id from customerData

    // let document_id = customerData?.data?.data?.[0]?.documentId;

    // console.log("orderid--->>", order_id);

    // //update customer details payload

    // const updateCustomerPayload = {
    //   data: {
    //     first_name: customerData?.data?.data?.[0]?.first_name || "NA",
    //     last_name: customerData?.data?.data?.[0]?.last_name || "NA",
    //     father_name: customerData?.data?.data?.[0]?.father_name || "NA",
    //     samagra_id: customerData?.data?.data?.[0]?.samagra_id || "NA",
    //     class: customerData?.data?.data?.[0]?.class || 0,
    //     resident_type: customerData?.data?.data?.[0]?.resident_type || "NA",
    //     aadhaar: customerData?.data?.data?.[0]?.aadhaar || "NA",
    //     marks_previous_class:
    //       customerData?.data?.data?.[0]?.marks_previous_class || 0,
    //     caste: customerData?.data?.data?.[0]?.caste || "NA",
    //     application_status:
    //       customerData?.data?.data?.[0]?.application_status || "NA",
    //     current_school_name:
    //       customerData?.data?.data?.[0]?.current_school_name || "NA",
    //     current_school_address:
    //       customerData?.data?.data?.[0]?.current_school_address || "NA",
    //     application_date: customerData?.data?.data?.[0]?.application_date,
    //     phone: customerData?.data?.data?.[0]?.phone || "NA",
    //     gender: customerData?.data?.data?.[0]?.gender || "NA",
    //     order_id: order_id || 0,
    //     transaction_id: customerData?.data?.data?.[0]?.transaction_id || "NA",
    //     submission_id: customerData?.data?.data?.[0]?.submission_id || "NA",
    //     content_id: customerData?.data?.data?.[0]?.content_id || "NA",
    //   },
    // };

    // console.log("updateCustomerPayload--->>", updateCustomerPayload);

    // console.log(
    //   "urlll--->>>",

    //   `${this.strapi_base_url}/api/applications/${document_id}`,
    //   updateCustomerPayload
    // );

    // // Axios POST call
    // const orderDetails = await axios.put(
    //   `${this.strapi_base_url}/api/applications/${document_id}`,
    //   updateCustomerPayload
    // );

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

  async handleInitSubmitV2(body: any) {
    try {
      const submission_id = uuidv4();

      const payload = {
        RequestInfo: {
          apiId: "application-services",
          ver: "1.0.0",
          ts: Date.now(),
          action: "add",
          did: "ASdassad",
          key: "Asd",
          msgId: "search with from and to values",
          authToken: "token",
          userInfo: {
            id: 24226,
            uuid: uuidv4(),
            userName: `user${Math.floor(Math.random() * 10000)}`,
            name: `${body?.firstName} ${body?.lastName}` || "NA",
            mobileNumber: body?.phone || "NA",
            emailId: body?.email || "NA",
            type: "EMPLOYEE",
            active: true,
            tenantId: "pb.amritsar",
          },
        },
        Application: {
          id: null,
          tenantId: "pb",
          applicationNumber: null,
          individualId: "IndUs-123",
          programCode: "PROG-001",
          status: null,
          wfStatus: null,
          auditDetails: null,
          additionalDetails: {},
          applicant: {
            id: Math.random().toString(36).substring(2, 12),
            studentName: `${body?.firstName} ${body?.lastName}` || "NA",
            fatherName: body?.fatherName || "NA",
            caste: body?.caste || "NA",
            income: body?.annualIncome || "NA",
            gender: body?.gender,
            age: body?.age || 10,
            disability: body?.disability || false,
          },
          schema:
            '[{"name":"id","value":"b642cec5-5c14-4c6a-b1cd-d017b5fb4cad"},{"name":"applicationNumber","value":"PB-BTR-2024-11-17-000148"},{"name":"individualId","value":"IndUs-123"},{"name":"programCode","value":"PROG-001"},{"name":"status","value":"ARCHIVED"},{"name":"applicantId","value":"applicant-132"},{"name":"studentName","value":"John Doe"},{"name":"fatherName","value":"Richard Doe"},{"name":"samagraId","value":"samagra-001"},{"name":"currentSchoolName","value":"ABC High School"},{"name":"currentSchoolAddress","value":"123 Main St, City, State"},{"name":"currentSchoolAddressDistrict","value":"District 1"},{"name":"currentClass","value":"10"},{"name":"previousYearMarks","value":"85"},{"name":"studentType","value":"Regular"},{"name":"aadharLast4Digits","value":"1234"},{"name":"caste","value":"General"},{"name":"income","value":"50000"},{"name":"gender","value":"Male"},{"name":"age","value":"15"},{"name":"disability","value":"false"}]',
        },
      };

      // Create the FormData object
      const formData = new FormData();

      // Append the JSON payload for the 'application' field
      formData.append("application", JSON.stringify(payload));

      let savePath = null;

      // If there's a hostelerProof file, handle the file data
      if (body?.hostelerProof) {
        // Decode the base64 string for the file
        const base64Content = body?.hostelerProof.split(",")[1]; // Remove the data URI prefix
        const binaryData = Buffer.from(base64Content, "base64");

        // Generate file path for saving the file temporarily
        const targetFolder = path.join(__dirname, "target");
        savePath = path.join(targetFolder, "hostelerProof.pdf");
        const dir = path.dirname(savePath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
          console.log(`Directory created: ${dir}`);
        }

        // Save the decoded file to the file system
        fs.writeFileSync(savePath, binaryData);
        console.log(`File saved at: ${savePath}`);

        // Append the file to the FormData
        formData.append("files", fs.createReadStream(savePath), {
          filename: "hostelerProof.pdf", // Optional: Provide a filename
          contentType: "application/pdf", // Optional: Define the content type if necessary
        });
      }

      // Make the POST request with the FormData
      const response = await fetch(
        "https://devpiramal.tekdinext.com/application/v1/_create",
        {
          method: "POST",
          body: formData,
          headers: {
            ...formData.getHeaders(), // This will include Content-Type with the correct boundary
          },
        }
      );

      console.log("response--->>", response);

      // Clean up the temporary file
      if (savePath) {
        fs.unlinkSync(savePath); // Remove the temporary file
        console.log(`File deleted: ${savePath}`);
      }

      // Handle the response

      return submission_id;
    } catch (error) {
      console.error("Error during submission:", error);
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
