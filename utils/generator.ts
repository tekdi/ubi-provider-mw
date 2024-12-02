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
    name: providerArr[0].providingEntity?.name,
    short_desc: providerArr[0].benefitContent?.shortDescription,
    images: [
      {
        url: "https://fastly.picsum.photos/id/24/200/200.jpg?hmac=Tw5b43UPAehS5e4JyB0qMQysvfLBmu_GZ_iafWou3m8",
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

  const fulfillments = [
    {
      state: {
        descriptor: {
          code: "application_status",
          name: providerArr[0]?.status,
        },
        updated_at: "2023-02-06T09:55:41.161Z",
      },
      id: "VSP_FUL_114",
      type: "SCHOLARSHIP",
      tracking: false,
      agent: {
        person: {
          name: "Ekstep Foundation SPoc",
        },
        contact: {
          email: "ekstepsupport@ekstep.com",
        },
      },
      customer: {
        id: "aadhaar:798677675565",
        person: {
          name: "Jane Doe",
          age: "13",
          gender: "female",
        },
        contact: {
          phone: "+91-9663088848",
          email: "jane.doe@example.com",
        },
      },
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
      const eligibilityTags = course?.eligibility?.map(
        (eligibilityItem: any) => {
          const conditionValues = Array.isArray(
            eligibilityItem.criteria.conditionValues
          )
            ? eligibilityItem.criteria.conditionValues.join(", ")
            : eligibilityItem.criteria.conditionValues; // if not an array, use the value as it is

          const tag = {
            display: true,
            descriptor: {
              code: `${eligibilityItem.type}-eligibility`,
              name: `${
                eligibilityItem.type.charAt(0).toUpperCase() +
                eligibilityItem.type.slice(1)
              } eligibility`,
              short_desc: eligibilityItem.description || "",
            },
            list: [
              {
                descriptor: {
                  code: `${eligibilityItem.criteria.name}-eligibility`,
                  name: `${
                    eligibilityItem.criteria.name.charAt(0).toUpperCase() +
                    eligibilityItem.criteria.name.slice(1)
                  } eligibility`,
                  short_desc: eligibilityItem.description || "",
                },
                value: conditionValues,
                display: true,
              },
            ],
          };
          return tag;
        }
      );

      const additionalBenefitTag = {
        display: true,
        descriptor: {
          code: "additional-benefit-details",
          name: "Additional Benefit Details",
          short_desc:
            "Information regarding additional benefits like scholarships, financial assistance, etc.",
        },
        list: [
          {
            descriptor: {
              code: "category",
              name: "Category",
              short_desc: "The category of the benefit",
            },
            value: providerArr?.[0]?.basicDetails?.category,
            display: true,
          },
          {
            descriptor: {
              code: "subCategory",
              name: "SubCategory",
              short_desc: "The subcategory of the benefit",
            },
            value: providerArr?.[0]?.basicDetails?.subCategory,
            display: true,
          },
          {
            descriptor: {
              code: "tags",
              name: "Tags",
              short_desc: "Keywords related to the scholarship",
            },
            value: providerArr?.[0]?.basicDetails?.tags?.join(","),
            display: true,
          },
        ],
      };

      // Include the additional benefit tag in the eligibilityTags array
      eligibilityTags.push(additionalBenefitTag);

      const sponsoringEntitiesTags = providerArr?.[0]?.sponsoringEntities?.map(
        (entity: any, index: number) => ({
          display: true,
          descriptor: {
            code: `sponsoring-entity`,
            name: `Sponsoring Entity`,
            short_desc: `Details of the sponsoring entity ${index + 1}`,
          },
          list: [
            {
              descriptor: {
                code: "type",
                name: "Type",
                short_desc: "The type of the sponsoring entity",
              },
              value: entity?.type,
              display: true,
            },
            {
              descriptor: {
                code: "name",
                name: "Name",
                short_desc: "The name of the sponsoring entity",
              },
              value: entity?.name,
              display: true,
            },
            {
              descriptor: {
                code: "address",
                name: "Address",
                short_desc: "The address of the sponsoring entity",
              },
              value: "Some Street New-Delhi Delhi 110001",
              display: true,
            },
            {
              descriptor: {
                code: "department",
                name: "Department",
                short_desc: "The department of the sponsoring entity",
              },
              value: "Ministry of Tribal Welfare Department",
              display: true,
            },
            {
              descriptor: {
                code: "contact-info",
                name: "Contact Information",
                short_desc: "Contact details of the sponsoring entity",
              },
              value: `Phone: 1234567890, Email: contact@mtw.gov.in`,
              display: true,
            },
            {
              descriptor: {
                code: "sponsor-share",
                name: "Sponsor Share",
                short_desc: "The sponsor's share percentage",
              },
              value: entity?.sponsorShare,
              display: true,
            },
          ],
        })
      );

      // Add the sponsoring entities tags to the eligibility tags
      if (sponsoringEntitiesTags) {
        eligibilityTags.push(...sponsoringEntitiesTags);
      }

      const mapDocumentsToTags = (documents: any[]) => {
        if (!documents || !Array.isArray(documents)) return []; // Ensure it always returns an array

        return {
          display: true,
          descriptor: {
            code: "required-docs",
            name: "Required Documents",
          },
          list: documents.map((doc: any) => ({
            descriptor: {
              code: doc.documentType,
              name: doc.isRequired ? "Mandatory Document" : "Optional Document",
            },
            value: doc.allowedProofs.join(", "), // Join the allowed proofs into a comma-separated string
            display: true,
          })),
        };
      };

      eligibilityTags.push(mapDocumentsToTags(providerArr?.[0]?.documents));
      const providerItem = {
        id: course.provider_id,
        descriptor: {
          name: course?.basicDetails?.title || "NA",
          long_desc: course?.benefitContent?.longDescription || "NA",
        },
        price: {
          currency: course?.benefitContent?.currency || "$",
          value: course?.benefitContent?.amount || "5000",
        },
        time: {
          range: {
            start: "2024-10-31T00:00:00+00:00",
            end: "2024-12-31T00:00:00+00:00",
          },
        },
        rateable: false,
        tags: eligibilityTags,
        category_ids: categories.map((category) => category.id),
        location_ids: locations.map((location) => location.id),
        fulfillments: fulfillments.map((fulfillment) => fulfillment),
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

// export const selectItemMapper = (providerArr: any) => {
//   console.log("providerArr009-->>", JSON.stringify(providerArr));
//   const id = providerArr[0].provider_id;

//   const descriptor: components["schemas"]["Descriptor"] = {
//     name: providerArr[0].providerName,
//     short_desc: providerArr[0].description,
//     images: [
//       {
//         url: "https://xyz.com/logo",
//       },
//     ],
//   };

//   const categories: components["schemas"]["Category"][] = providerArr.map(
//     (course: any) => {
//       const pCategory = {
//         id: course?.category ? course.category : "",
//         descriptor: {
//           code: course?.category ? course.category : "",
//           name: course?.category ? course.category : "",
//         },
//       };
//       return pCategory;
//     }
//   );

//   const fulfillments: components["schemas"]["Fulfillment"][] = [
//     {
//       id: "DSEP_FUL_63587501",
//       tracking: false,
//     },
//   ];

//   const locations: components["schemas"]["Location"][] = [
//     {
//       id: "L1",
//       city: {
//         name: "Pune",
//         code: "std:020",
//       },
//       state: {
//         name: "Maharastra",
//         code: "MH",
//       },
//     },
//   ];

//   const items: components["schemas"]["Item"][] = providerArr.map(
//     (course: any) => {
//       const tags = [
//         {
//           display: true,
//           descriptor: {
//             code: "background-eligibility",
//             name: "Background eligibility",
//           },
//           list: [
//             {
//               descriptor: {
//                 code: "social-eligibility",
//                 name: "Social eligibility",
//                 short_desc:
//                   "Social eligibility of the candidate to be eligible",
//               },
//               value: course?.caste,
//               display: true,
//             },
//             {
//               descriptor: {
//                 code: "geography-eligibility",
//                 name: "Geography eligibility",
//                 short_desc:
//                   "Geography eligibility of the candidate to be eligible",
//               },
//               value: "maharashtra",
//               display: true,
//             },
//             {
//               descriptor: {
//                 code: "gender-eligibility",
//                 name: "Gender eligibility",
//                 short_desc: "Gender of the candidate to be eligible",
//               },
//               value: course?.gender,
//               display: true,
//             },
//             {
//               descriptor: {
//                 code: "ann-hh-inc",
//                 name: "Maximum Annual Household Income",
//                 short_desc:
//                   "Maximum Family income per annum above which will render the applicant ineligible",
//               },
//               value: course?.annual_income,
//               display: true,
//             },
//           ],
//         },
//         {
//           display: true,
//           descriptor: {
//             code: "geography-eligibility",
//             name: "Geography eligibility",
//           },
//           list: [
//             {
//               descriptor: {
//                 code: "state-eligibility",
//                 name: "State eligibility",
//                 short_desc: "State eligibility of the candidate to be eligible",
//               },
//               value: "maharashtra",
//               display: true,
//             },

//             {
//               descriptor: {
//                 code: "city-eligibility",
//                 name: "City eligibility",
//                 short_desc: "City of the candidate to be eligible",
//               },
//               value: "pune",
//               display: true,
//             },
//           ],
//         },
//         {
//           display: true,
//           descriptor: {
//             code: "academic-eligibility",
//             name: "Academic Eligibility",
//           },
//           list: [
//             {
//               descriptor: {
//                 code: "course-name",
//                 name: "Name of the course",
//               },
//               value: course.class,
//               display: true,
//             },
//             {
//               descriptor: {
//                 code: "min-percentage",
//                 name: "Minimum percentage of marks to be obtained in the course for eligibility",
//               },
//               value: "60",
//               display: true,
//             },
//           ],
//         },
//         {
//           display: true,
//           descriptor: {
//             code: "required-docs",
//             name: "Required documents",
//           },
//           list: [
//             {
//               descriptor: {
//                 code: "mandatory-doc",
//                 name: "Mandatory document",
//               },
//               value: "Applicant Photo",
//               display: true,
//             },
//             {
//               descriptor: {
//                 code: "mandatory-doc",
//                 name: "Mandatory document",
//               },
//               value: "Proof of Identity",
//               display: true,
//             },
//             {
//               descriptor: {
//                 code: "mandatory-doc",
//                 name: "Mandatory document",
//               },
//               value: "Proof of Address",
//               display: true,
//             },
//             {
//               descriptor: {
//                 code: "optional-doc",
//                 name: "Optional document",
//               },
//               value: "PAN No/Domicile certificate",
//               display: true,
//             },
//           ],
//         },
//         {
//           display: true,
//           descriptor: {
//             code: "additional-info",
//             name: "Additional info",
//           },
//           list: [
//             {
//               descriptor: {
//                 code: "faq-url",
//                 name: "FAQ URL",
//                 short_desc: "Link to FAQ",
//               },
//               value: "https://www.vs.co.in/vs/resources/68/faq/1015_27.html",
//               display: true,
//             },
//             {
//               descriptor: {
//                 code: "tnc-url",
//                 name: "T&C URL",
//                 short_desc: "Link to terms & conditions",
//               },
//               value: "https://www.vs.co.in/vs/resources/68/tnc/1015_27.html",
//               display: true,
//             },
//           ],
//         },
//       ];
//       const providerItem = {
//         id: course.id,
//         descriptor: {
//           name: course.name || "",
//           long_desc: course.long_description || "",
//         },
//         price: {
//           currency: course?.currency,
//           value: course.amount || "",
//         },
//         time: {
//           range: {
//             start: "2023-01-03T13:23:01+00:00",
//             end: course?.applicationDeadline
//               ? course.applicationDeadline
//               : "2023-01-03T13:23:01+00:00",
//           },
//         },

//         rateable: false,
//         tags: tags,
//         category_ids: categories.map((category) => {
//           return category.id;
//         }),
//         location_ids: locations.map((location) => {
//           return location.id;
//         }),
//         fulfillment_ids: fulfillments.map((fulfillment) => {
//           return fulfillment.id;
//         }),
//       };
//       return providerItem;
//     }
//   );

//   const providerObj: components["schemas"]["Provider"] = {
//     id,
//     descriptor,
//     categories,
//     fulfillments,
//     locations,
//     items,
//     rateable: false,
//   };

//   return providerObj;
// };

export const selectItemMapperNew = (input: any, schemaJson?: any) => {
  console.log("input-->>123", JSON.stringify(input));
  let schemaJsonTag;

  const mapEligibilityToTags = (eligibilities: any[]) => {
    if (!eligibilities || !Array.isArray(eligibilities)) {
      // Ensure function returns an empty array for invalid input
      return [];
    }

    const eligibilityTags = eligibilities.map((eligibilityItem) => {
      const conditionValues = Array.isArray(
        eligibilityItem.criteria.conditionValues
      )
        ? eligibilityItem.criteria.conditionValues.join(", ")
        : eligibilityItem.criteria.conditionValues;

      return {
        display: true,
        descriptor: {
          code: `${eligibilityItem.type}-eligibility`,
          name: `${eligibilityItem.type
            .charAt(0)
            .toUpperCase()}${eligibilityItem.type.slice(1)} eligibility`,
          short_desc: eligibilityItem.description || "",
        },
        list: [
          {
            descriptor: {
              code: `${eligibilityItem.criteria.name}-eligibility`,
              name: `${eligibilityItem.criteria.name
                .charAt(0)
                .toUpperCase()}${eligibilityItem.criteria.name.slice(
                1
              )} eligibility`,
              short_desc: eligibilityItem.description || "",
            },
            value: conditionValues,
            display: true,
          },
        ],
      };
    });

    // Add any additional tags (if required)
    // For now, we assume additionalInfo contains required extra data

    return eligibilityTags;
  };

  const sponsoringEntitiesTags = input?.[0]?.sponsoringEntities?.map(
    (entity: any, index: number) => ({
      display: true,
      descriptor: {
        code: `sponsoring-entity`,
        name: `Sponsoring Entity`,
        short_desc: `Details of the sponsoring entity ${index + 1}`,
      },
      list: [
        {
          descriptor: {
            code: "type",
            name: "Type",
            short_desc: "The type of the sponsoring entity",
          },
          value: entity?.type,
          display: true,
        },
        {
          descriptor: {
            code: "name",
            name: "Name",
            short_desc: "The name of the sponsoring entity",
          },
          value: entity?.name,
          display: true,
        },
        {
          descriptor: {
            code: "address",
            name: "Address",
            short_desc: "The address of the sponsoring entity",
          },
          value: "Some Street New-Delhi Delhi 110001",
          display: true,
        },
        {
          descriptor: {
            code: "department",
            name: "Department",
            short_desc: "The department of the sponsoring entity",
          },
          value: "Ministry of Tribal Welfare Department",
          display: true,
        },
        {
          descriptor: {
            code: "contact-info",
            name: "Contact Information",
            short_desc: "Contact details of the sponsoring entity",
          },
          value: `Phone: 1234567890, Email: contact@mtw.gov.in`,
          display: true,
        },
        {
          descriptor: {
            code: "sponsor-share",
            name: "Sponsor Share",
            short_desc: "The sponsor's share percentage",
          },
          value: entity?.sponsorShare,
          display: true,
        },
      ],
    })
  );

  // const mapDocumentsToTags = (documents: any[]) => {
  //   if (!documents || !Array.isArray(documents)) return []; // Ensure it always returns an array

  //   return [
  //     {
  //       display: true,
  //       descriptor: {
  //         code: "required-docs",
  //         name: "Required Documents",
  //       },
  //       list: documents
  //         .filter((doc: any) => doc.isRequired) // Filter only mandatory documents
  //         .map((doc: any) => ({
  //           descriptor: {
  //             code: doc.documentType,
  //             name: "Mandatory Document", // Since only mandatory documents are included
  //           },
  //           value: doc.allowedProofs.join(", "),
  //           display: true,
  //         })),
  //     },
  //   ];
  // };

  const mapDocumentsToTags = (documents: any[], eligibilities: any[]) => {
    if (!documents || !Array.isArray(documents)) return []; // Ensure it always returns an array

    // Collect all allowedProofs from eligibilities
    const allEligibilityProofs = eligibilities.flatMap(
      (eligibility: any) => eligibility.allowedProofs || []
    );

    // Filter isRequired documents from the documents array
    const requiredDocuments = documents.filter((doc: any) => doc.isRequired);

    // Create a Set to track unique proofs
    const uniqueProofs = new Set<string>();

    // Combine isRequired documents and eligibility proofs
    const combinedDocuments = [
      ...requiredDocuments.map((doc: any) => {
        const filteredProofs = doc.allowedProofs.filter((proof: string) => {
          if (!uniqueProofs.has(proof)) {
            uniqueProofs.add(proof);
            return true;
          }
          return false;
        });
        return {
          ...doc,
          allowedProofs: filteredProofs,
        };
      }),
      ...allEligibilityProofs
        .filter((proof: string) => {
          if (!uniqueProofs.has(proof)) {
            uniqueProofs.add(proof);
            return true;
          }
          return false;
        })
        .map((proof: string) => ({
          documentType: "eligibilityProof",
          allowedProofs: [proof],
        })),
    ];

    // Format the result for the tags
    return [
      {
        display: true,
        descriptor: {
          code: "required-docs",
          name: "Required Documents",
        },
        list: combinedDocuments
          .filter((doc: any) => doc.allowedProofs.length > 0) // Filter out documents with no allowedProofs
          .map((doc: any) => ({
            descriptor: {
              code: doc.documentType,
              name: "Mandatory Document",
            },
            value: doc.allowedProofs.join(", "),
            display: true,
          })),
      },
    ];
  };

  if (schemaJson) {
    schemaJsonTag = {
      display: true,
      descriptor: {
        code: "benefit_schema",
        name: "benefit_schema",
        short_desc: "Information regarding scholarship schema",
      },
      list: [
        {
          descriptor: {
            code: "benefit_schema",
            name: "benefit_schema",
            short_desc: "Information regarding scholarship schema",
          },
          value: schemaJson || "N/A", // Default value if undefined
          display: true,
        },
      ],
    };
  }

  const additionalBenefitTag = {
    display: true,
    descriptor: {
      code: "additional-benefit-details",
      name: "Additional Benefit Details",
      short_desc:
        "Information regarding additional benefits like scholarships, financial assistance, etc.",
    },
    list: [
      {
        descriptor: {
          code: "category",
          name: "Category",
          short_desc: "The category of the benefit",
        },
        value: input?.[0]?.basicDetails?.category || "N/A", // Default value if undefined
        display: true,
      },
      {
        descriptor: {
          code: "subCategory",
          name: "SubCategory",
          short_desc: "The subcategory of the benefit",
        },
        value: input?.[0]?.basicDetails?.subCategory || "N/A", // Default value if undefined
        display: true,
      },
      {
        descriptor: {
          code: "tags",
          name: "Tags",
          short_desc: "Keywords related to the scholarship",
        },
        value: input?.[0]?.basicDetails?.tags?.join(",") || "N/A", // Default value if undefined
        display: true,
      },
    ],
  };

  let providerObj = {
    provider: {
      id: input?.[0]?.provider_id,
      descriptor: {
        name: input?.[0]?.providingEntity?.name,
        short_desc: input?.[0]?.benefitContent?.shortDescription,
        images: [
          {
            url: "https://fastly.picsum.photos/id/24/200/200.jpg?hmac=Tw5b43UPAehS5e4JyB0qMQysvfLBmu_GZ_iafWou3m8",
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
        id: input?.[0]?.provider_id,
        descriptor: {
          name: input?.[0]?.basicDetails?.title || "NA",
          long_desc: input?.[0]?.benefitContent?.longDescription || "NA",
        },
        price: {
          currency: input?.[0]?.benefitContent?.currency || "$",
          value: input?.[0]?.benefitContent?.amount || "5000",
        },
        time: {
          range: {
            start: "2024-10-31T00:00:00+00:00",
            end: "2024-12-31T00:00:00+00:00",
          },
        },
        rateable: false,

        tags: [
          ...mapEligibilityToTags(input?.[0]?.eligibility),
          ...sponsoringEntitiesTags, // Dynamically mapped tags
          ...mapDocumentsToTags(
            input?.[0]?.documents || [],
            input?.[0]?.eligibility || []
          ), // Pass documents and eligibility arrays
          additionalBenefitTag,
          schemaJsonTag,
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
  let providerObj = {
    order: {
      id: input?.[0]?.order_id,
      provider: {
        id: input?.[0]?.provider_id,
        descriptor: {
          name: input?.[0]?.providingEntity?.name,
          short_desc: input?.[0]?.benefitContent?.shortDescription,
          images: [
            {
              url: "https://fastly.picsum.photos/id/24/200/200.jpg?hmac=Tw5b43UPAehS5e4JyB0qMQysvfLBmu_GZ_iafWou3m8",
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
          id: input?.[0]?.provider_id,
          descriptor: {
            name: input?.[0]?.basicDetails?.title || "NA",
            long_desc: input?.[0]?.benefitContent?.longDescription || "NA",
          },
          price: {
            currency: input?.[0]?.benefitContent?.currency || "$",
            value: input?.[0]?.benefitContent?.amount || "5000",
          },
          time: {
            range: {
              start: "2024-10-31T00:00:00+00:00",
              end: "2024-12-31T00:00:00+00:00",
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
                  value: input?.[0]?.caste || "General",
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
                  value: input?.[0]?.gender || "All",
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
                  value: input?.[0]?.class,
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
                    short_desc: "Demo terms and conditions",
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
