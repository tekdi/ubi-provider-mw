import { components } from "types/schema";
import { SwayamApiResponse } from "types/SwayamApiResponse";
import { SwayamCourse } from "types/SwayamCourese";

export const flnCatalogGeneratorV3 = (apiData: any, query: string) => {
  const courses: ReadonlyArray<{ node: any }> = apiData;
  const providerWise = {};
  let categories: any = new Set();

  courses.forEach((course, index) => {
    const item = course;
    const provider = "fln";
    // creating the provider wise map
    if (providerWise[provider]) {
      providerWise[provider].push(item);
    } else {
      providerWise[provider] = [item];
    }
  });

  categories = [];

  const catalog = {};
  catalog["descriptor"] = { name: `Catalog for ${query}` };

  // adding providers
  catalog["providers"] = Object.keys(providerWise).map((provider: string) => {
    const providerObj: components["schemas"]["Provider"] = {
      id: provider,
      descriptor: {
        name: provider,
      },
      categories: [],
      items: providerWise[provider].map((course: any) => {
        const providerItem = {
          id: `${course.id}`,
          parent_item_id: "",
          descriptor: {
            name: course.title,
            long_desc: course.description ? course.description : "",
            images: [
              {
                url:
                  course.image === null
                    ? encodeURI(
                        "https://thumbs.dreamstime.com/b/set-colored-pencils-placed-random-order-16759556.jpg"
                      )
                    : encodeURI(course.image),
              },
            ],
          },
          price: {
            currency: "INR",
            value: 0 + "", // map it to an actual response
          },
          category_id: course.primaryCategory || "",
          recommended: course.featured ? true : false,
          time: {
            label: "Course Schedule",
            duration: `P${12}W`, // ISO 8601 duration format
            range: {
              start: "2023-07-23T18:30:00.000000Z",
              end: "2023-10-12T18:30:00.000000Z",
            },
          },
          rating: Math.floor(Math.random() * 6).toString(), // map it to an actual response
          tags: [
            {
              name: "courseInfo",
              list: [
                {
                  name: "credits",
                  value: course.credits || "",
                },
                {
                  name: "instructors",
                  value: "",
                },
                {
                  name: "offeringInstitue",
                  value: course.sourceOrganisation || "",
                },
                {
                  name: "url",
                  value: encodeURI(course.link || ""),
                },
                {
                  name: "enrollmentEndDate",
                  value: "2023-07-31T18:29:00.000000Z",
                },
              ],
            },
          ],
          rateable: false,
        };
        return providerItem;
      }),
    };
    return providerObj;
  });

  return catalog;
};

export const flnCatalogGeneratorV4 = (apiData: any, query: string) => {
  const courses: ReadonlyArray<{ node: any }> = apiData;
  const providerWise = {};
  let categories: any = new Set();

  courses.forEach((course, index) => {
    const item = course;
    const provider = "fln";
    // creating the provider wise map
    if (providerWise[provider]) {
      providerWise[provider].push(item);
    } else {
      providerWise[provider] = [item];
    }
  });

  categories = [];

  const catalog = {};
  catalog["descriptor"] = { name: `Catalog for ${query}` };

  // adding providers
  catalog["providers"] = Object.keys(providerWise).map((provider: string) => {
    const providerObj: components["schemas"]["Provider"] = {
      id: provider,
      descriptor: {
        name: provider,
      },
      categories: [],
      items: providerWise[provider].map((course: any) => {
        const providerItem = {
          id: `${course.id}`,
          parent_item_id: "",
          descriptor: {
            name: course.attributes.title,
            long_desc: course.attributes.description
              ? course.attributes.description
              : "",
            code: course.attributes.code,
            competency: course.attributes.competency,
            contentType: course.attributes.contentType,
            domain: course.attributes.domain,
            goal: course.attributes.goal,
            language: course.attributes.language,
            link: course.attributes.link,
            sourceOrganisation: course.attributes.sourceOrganisation,
            themes: course.attributes.themes,
            title: course.attributes.title,
            images: [
              {
                url:
                  course.attributes.image == null
                    ? encodeURI(
                        "https://thumbs.dreamstime.com/b/set-colored-pencils-placed-random-order-16759556.jpg"
                      )
                    : encodeURI(course.attributes.image),
              },
            ],
          },
          price: {
            currency: "INR",
            value: 0 + "", // map it to an actual response
          },
          category_id: course.primaryCategory || "",
          recommended: course.featured ? true : false,
          time: {
            label: "Course Schedule",
            duration: `P${12}W`, // ISO 8601 duration format
            range: {
              start: "2023-07-23T18:30:00.000000Z",
              end: "2023-10-12T18:30:00.000000Z",
            },
          },
          rating: Math.floor(Math.random() * 6).toString(), // map it to an actual response
          tags: [
            {
              name: "courseInfo",
              list: [
                {
                  name: "credits",
                  value: course.attributes.credits || "",
                },
                {
                  name: "instructors",
                  value: "",
                },
                {
                  name: "offeringInstitue",
                  value: course.attributes.sourceOrganisation || "",
                },
                {
                  name: "url",
                  value: encodeURI(course.attributes.link || ""),
                },
                {
                  name: "enrollmentEndDate",
                  value: "2023-07-31T18:29:00.000000Z",
                },
              ],
            },
          ],
          rateable: false,
        };
        return providerItem;
      }),
    };
    return providerObj;
  });

  return catalog;
};

export const flnCatalogGenerator = (apiData: any, query: string) => {
  const courses: ReadonlyArray<{ node: any }> = apiData;
  const providerWise = {};
  let categories: any = new Set();

  courses?.forEach((course: any, index) => {
    const item = course;
    const provider = course.provider_id;
    // creating the provider wise map
    if (providerWise[provider]) {
      providerWise[provider].push(item);
    } else {
      providerWise[provider] = [item];
    }
  });

  categories = [];

  const catalog = {};
  catalog["descriptor"] = { name: `Catalog for ${query}` };

  // adding providers
  catalog["providers"] = Object.entries(providerWise).map(([id, provider]) => {
    return selectItemMapper(provider);
  });

  return catalog;
};

export const scholarshipCatalogGenerator = (apiData: any, query: string) => {
  console.log("apidata 370", apiData);
  const courses: ReadonlyArray<{ node: any }> = apiData;
  const providerWise = {};
  let categories: any = new Set();

  courses.forEach((course, index) => {
    const item = course;
    const provider = "fln";
    // creating the provider wise map
    if (providerWise[provider]) {
      providerWise[provider].push(item);
    } else {
      providerWise[provider] = [item];
    }
  });

  categories = [];

  const catalog = {};
  catalog["descriptor"] = { name: `Catalog for ${query}` };

  // adding providers
  catalog["providers"] = Object.keys(providerWise).map((provider: string) => {
    const providerObj: components["schemas"]["Provider"] = {
      id: provider,
      descriptor: {
        name: provider,
      },
      categories: providerWise[provider].map((course: any) => {
        const providerItem = {
          id: course.category,
          parent_category_id: course.category || "",
          descriptor: {
            name: course.category,
          },
        };
        return providerItem;
      }),
      items: providerWise[provider].map((course: any) => {
        const providerItem = {
          id: `${course.id}`,
          parent_item_id: "",
          descriptor: {
            domain: course.domain,
            name: course.name ? course.name : "",
            code: course.code ? course.code : "123",
            description: course.description,
            provider: course.provider,
            creator: course.creator,
            category: course.category,
            applicationDeadline: course.applicationDeadline,
            amount: course.amount,
            duration: course.duration,
            eligibilityCriteria: course.eligibilityCriteria,
            applicationProcessing: course.applicationProcessing,
            selectionCriteria: course.selectionCriteria,
            noOfRecipients: course.noOfRecipients,
            termsAndConditions: course.termsAndConditions,
            curricularGoals: course.curricularGoals,
            learningOutcomes: course.learningOutcomes,
            additionalResources: course.additionalResources,
            applicationSubmissionDate: course.applicationSubmissionDate,
            contactInformation: course.contactInformation,
            status: course.status,
            keywords: course.keywords,
            createdAt: course.createdAt,

            images: [
              {
                url:
                  course.image == null
                    ? encodeURI(
                        "https://thumbs.dreamstime.com/b/set-colored-pencils-placed-random-order-16759556.jpg"
                      )
                    : encodeURI("https://image/" + course.image),
              },
            ],
          },
          price: {
            currency: "INR",
            value: 0 + "", // map it to an actual response
          },
          category_id: course.primaryCategory || "",
          recommended: course.featured ? true : false,
          time: {
            label: "Course Schedule",
            duration: `P${12}W`, // ISO 8601 duration format
            range: {
              start: "2023-07-23T18:30:00.000000Z",
              end: "2023-10-12T18:30:00.000000Z",
            },
          },
          rating: Math.floor(Math.random() * 6).toString(), // map it to an actual response
          tags: [
            {
              descriptor: {
                name: "courseInfo",
              },
              list: [
                {
                  descriptor: {
                    name: "credits",
                  },
                  value: course.credits || "",
                },
                {
                  descriptor: {
                    name: "instructors",
                  },
                  value: "",
                },
                {
                  descriptor: {
                    name: "offeringInstitue",
                  },
                  value: course.sourceOrganisation || "",
                },
                {
                  descriptor: {
                    name: "url",
                  },
                  value: encodeURI(course.link || ""),
                },
                {
                  descriptor: {
                    name: "enrollmentEndDate",
                  },
                  value: course.createdAt || "",
                },
              ],
            },
          ],
          rateable: false,
        };
        return providerItem;
      }),
    };
    return providerObj;
  });

  return catalog;
};

export const generateOrder = (
  action: string,
  message_id: string,
  item: any,
  providerId: string,
  providerDescriptor: any,
  categoryId: string
) => {
  const order = {
    id: message_id + Date.now(),
    ref_order_ids: [],
    state: action === "confirm" ? "COMPLETE" : "ACTIVE",
    type: "DRAFT",
    provider: {
      id: providerId,
      descriptor: providerDescriptor,
      category_id: categoryId,
    },
    items: [item],
    fulfillments: {
      id: "",
      type: "ONLINE",
      tracking: false,
      customer: {},
      agent: {},
      contact: {},
    },
    created_at: new Date(Date.now()),
    updated_at: new Date(Date.now()),
    tags: [
      {
        display: true,
        name: "order tags",
        list: [
          {
            name: "tag_name",
            value: "value of the key in name",
            display: true,
          },
        ],
      },
    ],
  };

  return order;
};

export const selectItemMapper = (providerArr: any) => {
  console.log("providerArr-->>", JSON.stringify(providerArr));
  const id = providerArr[0].provider_id;

  const descriptor: components["schemas"]["Descriptor"] = {
    name: providerArr[0].provider,
    short_desc: providerArr[0].description,
    images: [
      {
        url: "https://xyz.com/logo",
      },
    ],
  };

  const categories: components["schemas"]["Category"][] = providerArr.map(
    (course: any) => {
      const pCategory = {
        id: course?.category ? course.category : "",
        descriptor: {
          code: course?.category ? course.category : "",
          name: course?.category ? course.category : "",
        },
      };
      return pCategory;
    }
  );

  const fulfillments: components["schemas"]["Fulfillment"][] = [
    {
      id: "DSEP_FUL_63587501",
      tracking: false,
    },
  ];

  const locations: components["schemas"]["Location"][] = [
    {
      id: "L1",
      city: {
        name: "Pune",
        code: "std:020",
      },
      state: {
        name: "Maharastra",
        code: "MH",
      },
    },
  ];

  const items: components["schemas"]["Item"][] = providerArr.map(
    (course: any) => {
      const tags = [
        {
          display: true,
          descriptor: {
            code: "background-eligibility",
            name: "Background eligibility",
          },
          list: [
            {
              descriptor: {
                code: "social-eligibility",
                name: "Social eligibility",
                short_desc:
                  "Social eligibility of the candidate to be eligible",
              },
              value: course?.caste,
              display: true,
            },
            {
              descriptor: {
                code: "gender-eligibility",
                name: "Gender eligibility",
                short_desc: "Gender of the candidate to be eligible",
              },
              value: course?.gender,
              display: true,
            },
            {
              descriptor: {
                code: "ann-hh-inc",
                name: "Maximum Annual Household Income",
                short_desc:
                  "Maximum Family income per annum above which will render the applicant ineligible",
              },
              value: course?.annual_income,
              display: true,
            },
          ],
        },
        {
          display: true,
          descriptor: {
            code: "academic-eligibility",
            name: "Academic Eligibility",
          },
          list: [
            {
              descriptor: {
                code: "course-name",
                name: "Name of the course",
              },
              value: course.class,
              display: true,
            },
            {
              descriptor: {
                code: "min-percentage",
                name: "Minimum percentage of marks to be obtained in the course for eligibility",
              },
              value: "60",
              display: true,
            },
          ],
        },
        {
          display: true,
          descriptor: {
            code: "required-docs",
            name: "Required documents",
          },
          list: [
            {
              descriptor: {
                code: "mandatory-doc",
                name: "Mandatory document",
              },
              value: "Applicant Photo",
              display: true,
            },
            {
              descriptor: {
                code: "mandatory-doc",
                name: "Mandatory document",
              },
              value: "Proof of Identity",
              display: true,
            },
            {
              descriptor: {
                code: "mandatory-doc",
                name: "Mandatory document",
              },
              value: "Proof of Address",
              display: true,
            },
            {
              descriptor: {
                code: "optional-doc",
                name: "Optional document",
              },
              value: "PAN No/Domicile certificate",
              display: true,
            },
          ],
        },
        {
          display: true,
          descriptor: {
            code: "additional-info",
            name: "Additional info",
          },
          list: [
            {
              descriptor: {
                code: "faq-url",
                name: "FAQ URL",
                short_desc: "Link to FAQ",
              },
              value: "https://www.vs.co.in/vs/resources/68/faq/1015_27.html",
              display: true,
            },
            {
              descriptor: {
                code: "tnc-url",
                name: "T&C URL",
                short_desc: "Link to terms & conditions",
              },
              value: "https://www.vs.co.in/vs/resources/68/tnc/1015_27.html",
              display: true,
            },
          ],
        },
      ];
      const providerItem = {
        id: course.id,
        descriptor: {
          name: course.name || "",
          long_desc: course.long_description || "",
        },
        price: {
          currency: course?.currency,
          value: course.amount || "",
        },
        time: {
          range: {
            start: "2023-01-03T13:23:01+00:00",
            end: "2023-02-03T13:23:01+00:00",
          },
        },
        rateable: false,
        tags: tags,
        category_ids: categories.map((category) => {
          return category.id;
        }),
        location_ids: locations.map((location) => {
          return location.id;
        }),
        fulfillment_ids: fulfillments.map((fulfillment) => {
          return fulfillment.id;
        }),
      };
      return providerItem;
    }
  );

  const providerObj: components["schemas"]["Provider"] = {
    id,
    descriptor,
    categories,
    fulfillments,
    locations,
    items,
    rateable: false,
  };

  return providerObj;
};

export const selectItemMapperNew = (input: any) => {
  console.log("input-->>", JSON.stringify(input));
  let providerObj = {
    provider: {
      id: input?.[0]?.id,
      descriptor: {
        name: input?.[0]?.name,
        short_desc: input?.[0]?.description,
        images: [
          {
            url: "https://xyz.com/logo",
          },
        ],
      },
      locations: [
        {
          id: "L1",
          city: {
            name: "Pune",
            code: "std:020",
          },
          state: {
            name: "Maharastra",
            code: "MH",
          },
        },
        {
          id: "L2",
          city: {
            name: "Thane",
            code: "std:022",
          },
          state: {
            name: "Maharastra",
            code: "MH",
          },
        },
      ],
      rateable: false,
    },
    items: [
      {
        id: input?.[0]?.id,
        descriptor: {
          name: input?.[0]?.name,
          long_desc: input?.[0]?.long_description,
        },
        price: {
          currency: input?.[0]?.currency,
          value: input?.[0]?.amount,
        },
        time: {
          range: {
            start: "2023-01-03T13:23:01+00:00",
            end: "2023-02-03T13:23:01+00:00",
          },
        },
        rateable: false,
        tags: [
          {
            display: true,
            descriptor: {
              code: "background-eligibility",
              name: "Background eligibility",
            },
            list: [
              {
                descriptor: {
                  code: "social-eligibility",
                  name: "Social eligibility",
                  short_desc:
                    "Social eligibility of the candidate to be eligible",
                },
                value: input?.[0]?.eligibility?.caste?.[0]?.caste_name,
                display: true,
              },
              {
                descriptor: {
                  code: "social-eligibility",
                  name: "Social eligibility",
                  short_desc:
                    "Social eligibility of the candidate to be eligible",
                },
                value: "ST",
                display: true,
              },
              {
                descriptor: {
                  code: "gender-eligibility",
                  name: "Gender eligibility",
                  short_desc: "Gender of the candidate to be eligible",
                },
                value: input?.[0]?.eligibility?.gender,
                display: true,
              },
              {
                descriptor: {
                  code: "ann-hh-inc",
                  name: "Maximum Annual Household Income",
                  short_desc:
                    "Maximum Family income per annum above which will render the applicant ineligible",
                },
                value: input?.[0]?.eligibility?.annual_income,
                display: true,
              },
            ],
          },
          {
            display: true,
            descriptor: {
              code: "academic-eligibility",
              name: "Academic Eligibility",
            },
            list: [
              {
                descriptor: {
                  code: "course-name",
                  name: "Name of the course",
                },
                value: input?.[0]?.eligibility?.class?.[0]?.class?.toString(),
                display: true,
              },
              {
                descriptor: {
                  code: "min-percentage",
                  name: "Minimum percentage of marks to be obtained in the course for eligibility",
                },
                value: "60",
                display: true,
              },
            ],
          },
          {
            display: true,
            descriptor: {
              code: "academic-eligibility",
              name: "Academic Eligibility",
            },
            list: [
              {
                descriptor: {
                  code: "course-name",
                  name: "Name of the course",
                },
                value: "Class-XII",
                display: true,
              },
              {
                descriptor: {
                  code: "min-percentage",
                  name: "Minimum percentage of marks to be obtained in the course for eligibility",
                },
                value: "60",
                display: true,
              },
            ],
          },
          {
            display: true,
            descriptor: {
              code: "academic-eligibility",
              name: "Academic Eligibility",
            },
            list: [
              {
                descriptor: {
                  code: "course-name",
                  name: "Name of the course",
                },
                value: "Bachelor of Dental Surgery (BDS)",
                display: true,
              },
              {
                descriptor: {
                  code: "course-level",
                  name: "Level of the course",
                },
                value: "Under Graduate",
                display: true,
              },
              {
                descriptor: {
                  code: "course-status",
                  name: "Status of the course",
                },
                value: "In-Progress",
                display: true,
              },
              {
                descriptor: {
                  code: "min-percentage",
                  name: "Minimum percentage of marks to be obtained in the course for eligibility",
                },
                value: "60",
                display: true,
              },
            ],
          },
          {
            display: true,
            descriptor: {
              code: "required-docs",
              name: "Required documents",
            },
            list: [
              {
                descriptor: {
                  code: "mandatory-doc",
                  name: "Mandatory document",
                },
                value: "Applicant Photo",
                display: true,
              },
              {
                descriptor: {
                  code: "mandatory-doc",
                  name: "Mandatory document",
                },
                value: "Proof of Identity",
                display: true,
              },
              {
                descriptor: {
                  code: "mandatory-doc",
                  name: "Mandatory document",
                },
                value: "Proof of Address",
                display: true,
              },
              {
                descriptor: {
                  code: "optional-doc",
                  name: "Optional document",
                },
                value: "PAN No/Domicile certificate",
                display: true,
              },
            ],
          },
          {
            display: true,
            descriptor: {
              code: "additional-info",
              name: "Additional info",
            },
            list: [
              {
                descriptor: {
                  code: "faq-url",
                  name: "FAQ URL",
                  short_desc: "Link to FAQ",
                },
                value: "https://www.vs.co.in/vs/resources/68/faq/1015_27.html",
                display: true,
              },
              {
                descriptor: {
                  code: "tnc-url",
                  name: "T&C URL",
                  short_desc: input?.[0]?.termsAndConditions,
                },
                value: "https://www.vs.co.in/vs/resources/68/tnc/1015_27.html",
                display: true,
              },
            ],
          },
        ],
        location_ids: ["L1", "L2"],
        fulfillment_ids: ["VSP_FUL_1113"],
      },
    ],
    fulfillments: [
      {
        id: "VSP_FUL_1113",
        tracking: false,
      },
    ],
    quote: {
      price: {
        currency: "INR",
        value: "250000",
      },
      breakup: [
        {
          title: "Tution fee",
          price: {
            currency: "INR",
            value: "150000",
          },
        },
        {
          title: "Hostel fee",
          price: {
            currency: "INR",
            value: "50000",
          },
        },
        {
          title: "Books",
          price: {
            currency: "INR",
            value: "50000",
          },
        },
      ],
    },
  };

  return providerObj;
};

export const confirmItemMapperNew = (input: any) => {
  console.log("input-->>", JSON.stringify(input));
  let providerObj = {
    order: {
      id: input?.[0]?.order_id,
      provider: {
        id: input?.[0]?.id,
        descriptor: {
          name: input?.[0]?.name,
          short_desc: input?.[0]?.description,
          images: [
            {
              url: "https://xyz.com/logo",
            },
          ],
        },
        locations: [
          {
            id: "L1",
            city: {
              name: "Pune",
              code: "std:020",
            },
            state: {
              name: "Maharastra",
              code: "MH",
            },
          },
          {
            id: "L2",
            city: {
              name: "Thane",
              code: "std:022",
            },
            state: {
              name: "Maharastra",
              code: "MH",
            },
          },
        ],
        rateable: false,
      },
      items: [
        {
          id: input?.[0]?.id,
          descriptor: {
            name: input?.[0]?.name,
            long_desc: input?.[0]?.long_description,
          },
          price: {
            currency: input?.[0]?.currency,
            value: input?.[0]?.amount,
          },
          time: {
            range: {
              start: "2023-01-03T13:23:01+00:00",
              end: "2023-02-03T13:23:01+00:00",
            },
          },
          rateable: false,
          tags: [
            {
              display: true,
              descriptor: {
                code: "background-eligibility",
                name: "Background eligibility",
              },
              list: [
                {
                  descriptor: {
                    code: "social-eligibility",
                    name: "Social eligibility",
                    short_desc:
                      "Social eligibility of the candidate to be eligible",
                  },
                  value: input?.[0]?.eligibility?.caste?.[0]?.caste_name,
                  display: true,
                },
                {
                  descriptor: {
                    code: "social-eligibility",
                    name: "Social eligibility",
                    short_desc:
                      "Social eligibility of the candidate to be eligible",
                  },
                  value: "ST",
                  display: true,
                },
                {
                  descriptor: {
                    code: "gender-eligibility",
                    name: "Gender eligibility",
                    short_desc: "Gender of the candidate to be eligible",
                  },
                  value: input?.[0]?.eligibility?.gender,
                  display: true,
                },
                {
                  descriptor: {
                    code: "ann-hh-inc",
                    name: "Maximum Annual Household Income",
                    short_desc:
                      "Maximum Family income per annum above which will render the applicant ineligible",
                  },
                  value: input?.[0]?.eligibility?.annual_income,
                  display: true,
                },
              ],
            },
            {
              display: true,
              descriptor: {
                code: "academic-eligibility",
                name: "Academic Eligibility",
              },
              list: [
                {
                  descriptor: {
                    code: "course-name",
                    name: "Name of the course",
                  },
                  value: input?.[0]?.eligibility?.class?.[0]?.class?.toString(),
                  display: true,
                },
                {
                  descriptor: {
                    code: "min-percentage",
                    name: "Minimum percentage of marks to be obtained in the course for eligibility",
                  },
                  value: "60",
                  display: true,
                },
              ],
            },
            {
              display: true,
              descriptor: {
                code: "academic-eligibility",
                name: "Academic Eligibility",
              },
              list: [
                {
                  descriptor: {
                    code: "course-name",
                    name: "Name of the course",
                  },
                  value: "Class-XII",
                  display: true,
                },
                {
                  descriptor: {
                    code: "min-percentage",
                    name: "Minimum percentage of marks to be obtained in the course for eligibility",
                  },
                  value: "60",
                  display: true,
                },
              ],
            },
            {
              display: true,
              descriptor: {
                code: "academic-eligibility",
                name: "Academic Eligibility",
              },
              list: [
                {
                  descriptor: {
                    code: "course-name",
                    name: "Name of the course",
                  },
                  value: "Bachelor of Dental Surgery (BDS)",
                  display: true,
                },
                {
                  descriptor: {
                    code: "course-level",
                    name: "Level of the course",
                  },
                  value: "Under Graduate",
                  display: true,
                },
                {
                  descriptor: {
                    code: "course-status",
                    name: "Status of the course",
                  },
                  value: "In-Progress",
                  display: true,
                },
                {
                  descriptor: {
                    code: "min-percentage",
                    name: "Minimum percentage of marks to be obtained in the course for eligibility",
                  },
                  value: "60",
                  display: true,
                },
              ],
            },
            {
              display: true,
              descriptor: {
                code: "required-docs",
                name: "Required documents",
              },
              list: [
                {
                  descriptor: {
                    code: "mandatory-doc",
                    name: "Mandatory document",
                  },
                  value: "Applicant Photo",
                  display: true,
                },
                {
                  descriptor: {
                    code: "mandatory-doc",
                    name: "Mandatory document",
                  },
                  value: "Proof of Identity",
                  display: true,
                },
                {
                  descriptor: {
                    code: "mandatory-doc",
                    name: "Mandatory document",
                  },
                  value: "Proof of Address",
                  display: true,
                },
                {
                  descriptor: {
                    code: "optional-doc",
                    name: "Optional document",
                  },
                  value: "PAN No/Domicile certificate",
                  display: true,
                },
              ],
            },
            {
              display: true,
              descriptor: {
                code: "additional-info",
                name: "Additional info",
              },
              list: [
                {
                  descriptor: {
                    code: "faq-url",
                    name: "FAQ URL",
                    short_desc: "Link to FAQ",
                  },
                  value:
                    "https://www.vs.co.in/vs/resources/68/faq/1015_27.html",
                  display: true,
                },
                {
                  descriptor: {
                    code: "tnc-url",
                    name: "T&C URL",
                    short_desc: input?.[0]?.termsAndConditions,
                  },
                  value:
                    "https://www.vs.co.in/vs/resources/68/tnc/1015_27.html",
                  display: true,
                },
              ],
            },
          ],
          location_ids: ["L1", "L2"],
          fulfillment_ids: ["VSP_FUL_1113"],
        },
      ],
      fulfillments: [
        {
          id: "VSP_FUL_1113",
          tracking: false,
        },
      ],
      quote: {
        price: {
          currency: "INR",
          value: "250000",
        },
        breakup: [
          {
            title: "Tution fee",
            price: {
              currency: "INR",
              value: "150000",
            },
          },
          {
            title: "Hostel fee",
            price: {
              currency: "INR",
              value: "50000",
            },
          },
          {
            title: "Books",
            price: {
              currency: "INR",
              value: "50000",
            },
          },
        ],
      },
    },
  };

  return providerObj;
};

export const confirmItemMapper = (item: any) => {
  console.log("item 716--------------------------------------", item);
  const confirmItemOrder = {
    id: `${item.order_id}` ? `${item.order_id}` : "",
    provider: {
      id: `${item.OrderContentRelationship.user_id}`
        ? `${item.OrderContentRelationship.user_id}`
        : "",
      descriptor: {
        name: "fln",
        short_desc: "",
        images: getMediaArray(item.OrderContentRelationship.image),
      },
      categories: [
        {
          id: "",
          descriptor: {
            code: "",
            name: "",
          },
        },
        {
          id: "",
          descriptor: {
            code: "",
            name: "",
          },
        },
        {
          id: "",
          descriptor: {
            code: "",
            name: "",
          },
        },
      ],
    },
    items: [
      {
        id: `${item.content_id}`,
        quantity: {
          maximum: {
            count: 1,
          },
        },
        descriptor: {
          name: `${item.OrderContentRelationship.title}`
            ? `${item.OrderContentRelationship.title}`
            : "",
          short_desc: "",
          long_desc: `${item.OrderContentRelationship.description}`
            ? `${item.OrderContentRelationship.description}`
            : "",
          images: [],
          media: getMediaArray(item.OrderContentRelationship.link),
        },
        creator: {
          descriptor: {
            name: "",
            short_desc: "",
            long_desc: "",
            images: [],
          },
        },
        price: {
          currency: "INR",
          value: "0",
        },
        category_ids: [""],
        rating: Math.floor(Math.random() * 6).toString(),
        rateable: false,
        add_ons: [
          {
            id: "",
            descriptor: {
              name: "",
              long_desc: "",
              media: [],
            },
          },
          {
            id: "",
            descriptor: {
              name: "",
              long_desc: "",
              media: [],
            },
          },
        ],
        tags: [
          {
            descriptor: {
              code: "courseDetails",
              name: "courseDetails",
            },
            list: [
              {
                descriptor: {
                  code: "title",
                  name: "title",
                },
                value: item.OrderContentRelationship.title ?? "",
              },

              {
                descriptor: {
                  code: "description",
                  name: "description",
                },
                value: item.OrderContentRelationship.description ?? "",
              },
              {
                descriptor: {
                  code: "url",
                  name: "url",
                },
                value: item.OrderContentRelationship.url ?? "",
              },
              {
                descriptor: {
                  code: "domain",
                  name: "domain",
                },
                value: item.OrderContentRelationship.domain ?? "",
              },
              {
                descriptor: {
                  code: "goal",
                  name: "goal",
                },
                value: item.OrderContentRelationship.goal ?? "",
              },
              {
                descriptor: {
                  code: "sourceOrganisation",
                  name: "sourceOrganisation",
                },
                value: item.OrderContentRelationship.sourceOrganisation ?? "",
              },
              {
                descriptor: {
                  code: "publisher",
                  name: "publisher",
                },
                value: item.OrderContentRelationship.publisher ?? "",
              },
              {
                descriptor: {
                  code: "learningOutcomes",
                  name: "learningOutcomes",
                },
                value: item.OrderContentRelationship.learningOutcomes ?? "",
              },
              {
                descriptor: {
                  code: "expiryDate",
                  name: "expiryDate",
                },
                value: item.OrderContentRelationship.expiryDate ?? "",
              },
              // {
              //   name: 'state',
              //   value: item.state ?? '',
              // },
              // {
              //   name: 'region',
              //   value: item.region ?? '',
              // },
              {
                descriptor: {
                  code: "minAge",
                  name: "minAge",
                },
                value: item.OrderContentRelationship.minAge ?? "",
              },
              {
                descriptor: {
                  code: "maxAge",
                  name: "maxAge",
                },
                value: item.OrderContentRelationship.maxAge ?? "",
              },
            ],
            display: true,
          },
        ],
      },
    ],
    fulfillments: [
      {
        state: {
          descriptor: {
            code: "",
            name: "",
          },
          updated_at: new Date(Date.now()),
        },
      },
      {
        agent: {
          person: {
            name: "",
          },
          contact: {
            email: "",
          },
        },
        customer: {
          person: {
            name: item.OrdersUserRelationship[0].name
              ? item.OrdersUserRelationship[0].name
              : "",
            age: item.OrdersUserRelationship[0].age
              ? item.OrdersUserRelationship[0].age
              : "",
            gender: item.OrdersUserRelationship[0].gender
              ? item.OrdersUserRelationship[0].gender
              : "",
          },
          contact: {
            phone: item.OrdersUserRelationship[0].phone
              ? item.OrdersUserRelationship[0].phone
              : "",
            email: item.OrdersUserRelationship[0].email
              ? item.OrdersUserRelationship[0].email
              : "",
          },
        },
        stops: [
          {
            id: "0",
            instructions: {
              name: "",
              long_desc: "",
              media: [],
            },
          },
          {
            id: "1",
            instructions: {
              name: "",
              long_desc: "",
              media: [],
            },
          },
        ],
        tags: [
          {
            descriptor: {
              code: "",
              name: "",
            },
            list: [
              {
                descriptor: {
                  code: "",
                  name: "",
                },
                value: "",
              },
              {
                descriptor: {
                  code: "",
                  name: "",
                },
                value: "",
              },
            ],
            display: true,
          },
        ],
      },
    ],
    quote: {
      price: {
        currency: "INR",
        value: "150",
      },
    },
    // billing:{
    //   name:"",
    //   phone:"",
    //   email:"",
    //   address:""
    // },
    payments: [
      {
        params: {
          amount: "150",
          currency: "INR",
        },
        type: "PRE-ORDER",
        status: "PAID",
        collected_by: "bpp",
      },
    ],
  };
  return confirmItemOrder;
};

export const averageRating = (data: any) => {
  let sum = 0;

  const crr = data.FlnContentRatingsRelationship;
  // console.log(crr.length)

  if (crr.length) {
    crr.forEach((i) => (sum += i.ratingValue));
  }

  const average = sum / crr.length;
  return average;
};

export const feedback = (data: any) => {
  const result = {
    ratingValues: [],
    feedbacks: [],
  };

  const filteredData = data.FlnContentRatingsRelationship.filter(
    (item) =>
      item.feedback &&
      item.feedback.trim() !== "null" &&
      item.feedback.trim() !== "undefined"
  );
  filteredData.sort((a, b) => b.id - a.id);

  const maxItems = Math.min(filteredData.length, 5);

  for (let i = 0; i < maxItems; i++) {
    const currentItem = filteredData[i];
    if (currentItem.ratingValue) {
      result.ratingValues.push(currentItem.ratingValue);
    }
    if (currentItem.feedback) {
      result.feedbacks.push(currentItem.feedback);
    }
  }

  return result;
};

// const getMediaArray = (url: string | undefined) => {
//   if (url) {
//     return [
//       {
//         url:encodeURI(url),
//       },
//     ];
//   }
//   return [];
// };

const getMediaArray = (url: string | undefined) => {
  if (url) {
    const formattedUrl = isValidUrl(url);
    if (formattedUrl) {
      return [
        {
          url: url,
        },
      ];
    } else {
      return [
        {
          url: encodeURI("https://image/" + url),
        },
      ];
    }
  }
  return [];
};

// Function to check if a string is a valid URL
const isValidUrl = (str: string) => {
  try {
    new URL(str);
    return true;
  } catch (error) {
    return false;
  }
};
