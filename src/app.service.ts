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
  private strapi_base_url = process.env.STRAPI_URL;

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
        `${this.strapi_base_url}/api/scholarships?populate[eligibility][populate]=*&populate[provider]=*&populate[financial_information][populate]=*&populate[sponsors]=*`
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

  mapFlnResponseToDesiredFormat(flnResponse: any[]): any[] {
    return flnResponse.map((item: any) => ({
      id: item?.id.toString(),
      documentId: item?.documentId,
      name: item?.name,
      description: item?.description,
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
      amount: item?.price || null, // Assuming 'price' represents the amount
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

    response.push(courseData?.data?.data?.[0]);

    // Use the mapping function to transform the response
    const mappedResponse = await this.mapFlnResponseToDesiredFormat(response);

    const provider: any = selectItemMapper(mappedResponse);
    selectDto.message.order = { provider };
    selectDto.context.action = "on_select";
    const resp = selectDto;
    return resp;
  }

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

    const { id, descriptor, categories, locations, items, rateable }: any =
      selectItemMapper(mappedResponse);
    const order_id: string = "TLEXP_" + this.generateRandomString();

    // get customer details based on submission id and content id

    const customerData = await axios.get(
      `${this.strapi_base_url}/api/applications?filters[$and][0][submission_id][$eq]=${submission_id}`
    );

    console.log("customerData-->>", customerData?.data?.data);
    // get document id from customerData

    let document_id = customerData?.data?.data?.[0]?.documentId;

    console.log("orderid--->>", order_id);

    //update customer details payload

    let updateCustomerPayload = {
      data: {
        name: customerData?.data?.data?.[0]?.name || "NA",
        email: customerData?.data?.data?.[0]?.email || "NA",
        phone: customerData?.data?.data?.[0]?.phone || "NA",
        gender: customerData?.data?.data?.[0]?.gender || "NA",
        order_id: order_id || "NA", // Using the order_id parameter passed, or 'NA'
        transaction_id: customerData?.data?.data?.[0]?.transaction_id || "NA",
        submission_id: customerData?.data?.data?.[0]?.submission_id || "NA",
        content_id: customerData?.data?.data?.[0]?.content_id || "NA",
      },
    };

    // Axios POST call
    const orderDetails = await axios.put(
      `${this.strapi_base_url}/api/applications/${document_id}`,
      updateCustomerPayload
    );

    items[0].xinput = {
      head: {
        descriptor: { name: "Application Form" },
        index: { min: 0, cur: 1, max: 1 },
      },
      form: {
        data: orderDetails?.data?.data,
        submission_id: orderDetails.data?.data?.submission_id,
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

      // Prepare the payload for the POST request
      const payload = {
        data: {
          name: body?.name || "NA",
          email: body?.email || "NA",
          phone: body?.phone || "NA",
          gender: body?.gender || "NA",
          order_id: body?.order_id || "NA",
          transaction_id: transaction_id,
          submission_id: submission_id,
          content_id: parseInt(id),
        },
      };

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
