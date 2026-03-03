Create from Template API parameters explained
What Create from Template API parameters represent and how they affect your Gamma creation. Read this before heading to the API Reference page.

🚧
The Create from Template API is currently in beta.
Functionality, rate limits, and pricing are subject to change.

The sample API requests below shows all required and optional API parameters, as well as sample responses.

Create from Template POST request
Success response
Error response
Error: No credits

curl --request POST \
     --url https://public-api.gamma.app/v1.0/generations/from-template \
     --header 'Content-Type: application/json' \
     --header 'X-API-KEY: sk-gamma-xxxxxxxx' \
     --data '
{
  "gammaId": "g_abcdef123456ghi",
  "prompt": "Rework this pitch deck for a non-technical audience.",
  "themeId": "Chisel",
  "folderIds": ["123abc456", "456def789"],
  "exportAs": "pdf"
  "imageOptions": {
    "model": "imagen-4-pro",
    "style": "photorealistic"
  },
  "sharingOptions": {
    "workspaceAccess": "view",
    "externalAccess": "noAccess",
    "emailOptions": {
      "recipients": ["email@example.com"],
      "access": "comment"
    }
  },
}
'
GET request
Success: status pending
Success: status completed
Error response

curl --request GET \
     --url https://public-api.gamma.app/v1.0/generations/yyyyyyyyyy \
     --header 'X-API-KEY: sk-gamma-xxxxxxxx' \
     --header 'accept: application/json'

Top level parameters
gammaId (required)
Identifies the template you want to modify. You can find and copy the gammaId for a template as shown in the screenshots below.





prompt (required)
Use this parameter to send text content, image URLs, as well as instructions for how to use this content in relation to the template gamma.

Add images to the input

You can provide URLs for specific images you want to include. Simply insert the URLs into your content where you want each image to appear (see example below). You can also add instructions for how to display the images, eg, "Group the last 10 images into a gallery to showcase them together."

Token limits

The total token limit is 100,000, which is approximately 400,000 characters, but because part of your input is the gamma template, in practice, the token limit for your prompt becomes shorter. We highly recommend keeping your prompt well below 100,000 tokens and testing out a variety of inputs to get a good sense of what works for your use case.

Other tips

Text can be as little as a few words that describe the topic of the content you want to generate.
You can also input longer text -- pages of messy notes or highly structured, detailed text.
You may need to apply JSON escaping to your text. Find out more about JSON escaping and try it out here.
Example

"prompt": "Change this pitch deck about deep sea exploration into one about space exploration."
Example

"prompt": "Change this pitch deck about deep sea exploration into one about space exploration. Use this quote and this image in the title card: That's one small step for man, one giant leap for mankind - Neil Armstrong, https://www.global-aero.com/wp-content/uploads/2020/06/ga-iss.jpg"

themeId (optional, defaults to the template's theme)
Defines which theme from Gamma will be used for the output. Themes determine the look and feel of the gamma, including colors and fonts.

You can use the GET Themes endpoint to pull a list of themes from your workspace. Or you can copy over the themeId from the app directly.

Example

"themeId": "abc123def456ghi"

folderIds (optional)
Defines which folder(s) your gamma is stored in.

You can use the GET Folders endpoint to pull a list of folders. Or you can copy over the folderIds from the app directly.


You must be a member of a folder to be able to add gammas to that folder.
Example

"folderIds": ["123abc456", "def456789"]

exportAs (optional)
Indicates if you'd like to return the generated gamma as a PDF or PPTX file as well as a Gamma URL.

Options are pdf or pptx
Download the files once generated as the links will become invalid after a period of time.
If you do not wish to directly export to a PDF or PPTX via the API, you may always do so later via the app.
Example

"exportAs": "pdf"

imageOptions
When you create content from a Gamma template, new images automatically match the image source used in the original template. For example if you used Pictographic images to generate your original template, any new images will be sourced from Pictographic.

For templates with AI-generated images, you can override the default AI image settings using the optional parameters below.

imageOptions.model (optional)
This field is relevant if the original template was created using AI generated images. The imageOptions.model parameter determines which model is used to generate new images.

You can choose from the models listed here.
If no value is specified for this parameter, Gamma automatically selects a model for you.
Example

"imageOptions": {
	"model": "flux-1-pro"
  }

imageOptions.style (optional)
This field is relevant if the original template was created using AI generated images. The imageOptions.style parameter influences the artistic style of the images generated.

You can add one or multiple words to define the visual style of the images you want.
Adding some direction -- even a simple one word like "photorealistic" -- can create visual consistency among the generated images.
Character limits: 1-500.
Example

"imageOptions": {
	"style": "minimal, black and white, line art"
  }

sharingOptions
sharingOptions.workspaceAccess (optional, defaults to workspace share settings)
Determines level of access members in your workspace will have to your generated gamma.

Options are: noAccess, view, comment, edit, fullAccess
fullAccessallows members from your workspace to view, comment, edit, and share with others.
Example

"sharingOptions": {
	"workspaceAccess": "comment"
}

sharingOptions.externalAccess (optional, defaults to workspace share settings)
Determines level of access members outside your workspace will have to your generated gamma.

Options are: noAccess, view, comment, or edit
Example

"sharingOptions": {
	"externalAccess": "noAccess"
}

sharingOptions.emailOptions (optional)
sharingOptions.emailOptions.recipients (optional)
Allows users to share gamma with specific recipients via their email.

Example

"sharingOptions": {
  "emailOptions": {
    "recipients": ["ceo@example.com", "cto@example.com"]
}
sharingOptions.emailOptions.access (optional)
Determines level of access users defined in sharingOptions.emailOptions.recipients have to your generated gamma.

Options are: view, comment, edit, or fullAccess
Example

"sharingOptions": {
  "emailOptions": {
    "access": "comment"
}

Generate a gamma

# Generate a gamma

Create a new gamma using this endpoint.

We highly recommend you read <Anchor label="Generate API parameters explained" target="_blank" href="https://developers.gamma.app/v1.0/update/docs/generate-api-parameters-explained#/">Generate API parameters explained</Anchor> before delving into this page.

For parameters with a long list of accepted values, please reference:

* `imageOptions.model` accepts values listed in <Anchor label="Image model accepted values" target="_blank" href="https://developers.gamma.app/v1.0/update/reference/image-model-accepted-values#/">Image model accepted values</Anchor>.
* `textOptions.language` accepts values listed in <Anchor label="Output language accepted values" target="_blank" href="https://developers.gamma.app/v1.0/update/reference/output-language-accepted-values#/">Output language accepted values</Anchor>.
* <Anchor label="List Themes and List Folders" target="_blank" href="https://developers.gamma.app/v1.0/update/docs/list-themes-and-list-folders-apis-explained#/">List Themes and List Folders</Anchor> endpoints can be used to find values for the `themeId` and `folderIds` parameters.

Generated gammas appear in a separate tab in your dashboard. This tab appears only after you have successfully created at least one gamma using the API.

<Image align="center" border={false} width="200px" src="https://files.readme.io/17465dfe3d8eb94935056596e8595f977aaf031ceb4488d060f310a3bb06abbe-CleanShot_2025-10-01_at_07.49.492x.png" />

<br />

# OpenAPI definition

```json
{
  "openapi": "3.0.0",
  "info": {
    "version": "1.0.0",
    "title": "Generate"
  },
  "servers": [
    {
      "url": "https://public-api.gamma.app"
    }
  ],
  "paths": {
    "/v1.0/generations": {
      "post": {
        "summary": "New Endpoint",
        "description": "This is your first endpoint! Edit this page to start documenting your API.",
        "operationId": "get_new-endpoint",
        "responses": {
          "200": {
            "description": "Successful response",
            "content": {
              "application/json": {
                "examples": {
                  "Success": {
                    "summary": "Success",
                    "value": {
                      "generationId": "xxxxxxxxxxx"
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "Bad Request",
            "content": {
              "application/json": {
                "examples": {
                  "Input errors": {
                    "value": {
                      "message": "Input validation errors: 1. …",
                      "statusCode": 400
                    },
                    "summary": "Input errors"
                  },
                  "New Example": {
                    "summary": "New Example",
                    "value": "{}"
                  }
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized",
            "content": {
              "application/json": {}
            }
          }
        },
        "parameters": [
          {
            "name": "Content-Type",
            "in": "header",
            "required": true,
            "description": "",
            "schema": {
              "type": "string",
              "default": "application/json"
            }
          },
          {
            "name": "X-API-KEY",
            "in": "header",
            "required": true,
            "description": "Enter your API key here.",
            "schema": {
              "type": "string",
              "default": ""
            }
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "properties": {
                  "inputText": {
                    "type": "string",
                    "description": "Text and image URLs used to generate your gamma. Can be as little as a few words or pages of text. Character limits: 1-100,000 tokens. Example: Pitch deck on deep sea exploration."
                  },
                  "textMode": {
                    "type": "string",
                    "default": "",
                    "description": "How you want your inputText to be modified by Gamma, if at all.",
                    "enum": [
                      "generate",
                      "condense",
                      "preserve"
                    ]
                  },
                  "format": {
                    "type": "string",
                    "description": "The type of artifact you want to create.",
                    "default": "presentation",
                    "enum": [
                      "presentation",
                      "document",
                      "webpage",
                      "social"
                    ]
                  },
                  "themeId": {
                    "type": "string",
                    "description": "The theme from Gamma that will be used for your creation. You can create custom themes in Gamma. If nothing is specified, the default theme for your workspace is chosen."
                  },
                  "numCards": {
                    "type": "integer",
                    "description": "How many cards you want to create when cardSplit is set to auto. Options: Pro users choose any integer between 1 and 60; Ultra users choose any integer between 1 and 75.",
                    "default": "10"
                  },
                  "cardSplit": {
                    "type": "string",
                    "default": "auto",
                    "description": "How you want your content to be divided up.",
                    "enum": [
                      "auto",
                      "inputTextBreaks"
                    ]
                  },
                  "additionalInstructions": {
                    "type": "string",
                    "description": "Extra specifications about the desired content and layouts. Character limits: 1-2000. Example: Make the titles catchy."
                  },
                  "folderIds": {
                    "type": "array",
                    "items": {
                      "type": "string"
                    },
                    "description": "The folder(s) where you want to store your gamma."
                  },
                  "exportAs": {
                    "type": "string",
                    "description": "Additional file types for saving your gamma.",
                    "enum": [
                      "pdf",
                      "pptx"
                    ]
                  },
                  "textOptions": {
                    "type": "object",
                    "properties": {
                      "amount": {
                        "type": "string",
                        "default": "medium",
                        "description": "How much text each card contains.",
                        "enum": [
                          "brief",
                          "medium",
                          "detailed",
                          "extensive"
                        ]
                      },
                      "tone": {
                        "type": "string",
                        "description": "Defines the mood or voice of the gamma. Character limits: 1-500. Example: professional and inspiring."
                      },
                      "audience": {
                        "type": "string",
                        "description": "Defines the intended readers/viewers of the gamma for a more catered output. Character limits: 1-500. Example: tech investors and enthusiasts."
                      },
                      "language": {
                        "type": "string",
                        "default": "en",
                        "description": "The intended language of your gamma. Accepts the language codes listed in the Output language accepted values page."
                      }
                    },
                    "description": "Attributes of the text you want to generate."
                  },
                  "imageOptions": {
                    "type": "object",
                    "description": "Attributes of the images you want to generate, if any.",
                    "properties": {
                      "source": {
                        "type": "string",
                        "default": "aiGenerated",
                        "description": "Where you want to source images for your gamma.",
                        "enum": [
                          "aiGenerated",
                          "pictographic",
                          "unsplash",
                          "webAllImages",
                          "webFreeToUse",
                          "webFreeToUseCommercially",
                          "giphy",
                          "placeholder",
                          "noImages"
                        ]
                      },
                      "model": {
                        "type": "string",
                        "description": "If you want AI generated images, this specifies which model to use. Options are listed in the Image Model accepted values page. If no value specified, Gamma automatically chooses a model for you. "
                      },
                      "style": {
                        "type": "string",
                        "description": "Influences the artistic style of the AI generated images. Character limits: 1-500. Example: minimal lineart style illustrations with lots of white space."
                      }
                    }
                  },
                  "cardOptions": {
                    "type": "object",
                    "properties": {
                      "dimensions": {
                        "type": "string",
                        "description": "Aspect ratio of the cards to be generated. Options for presentation: fluid (default), 16x9, 4x3; document: fluid (default), pageless, letter, a4; social: 1x1, 4x5 (default), 9x16."
                      },
                      "headerFooter": {
                        "type": "object",
                        "properties": {
                          "topLeft": {
                            "type": "object",
                            "properties": {
                              "type": {
                                "type": "string",
                                "description": "Required if you want to add content in this position. Specifies type of content.",
                                "enum": [
                                  "cardNumber",
                                  "image",
                                  "text"
                                ]
                              },
                              "value": {
                                "type": "string",
                                "description": "Required if type = text. Text content. Max : 500 chars."
                              },
                              "source": {
                                "type": "string",
                                "description": "Required if type = image. What image you want to use.",
                                "enum": [
                                  "themeLogo",
                                  "custom"
                                ]
                              },
                              "src": {
                                "type": "string",
                                "description": "Required if type = image and source = custom. URL of custom image. Max: 2048 chars."
                              },
                              "size": {
                                "type": "string",
                                "description": "Relevant if type = image.",
                                "enum": [
                                  "sm",
                                  "md",
                                  "lg",
                                  "xl"
                                ]
                              }
                            },
                            "description": "Content in the left section of the header."
                          },
                          "topCenter": {
                            "type": "object",
                            "properties": {
                              "type": {
                                "type": "string",
                                "description": "Required if you want to add content in this position. Specifies type of content."
                              }
                            },
                            "description": "Same structure as topLeft. Content displayed in the top-center of cards."
                          },
                          "topRight": {
                            "type": "object",
                            "description": "Same structure as topLeft. Content displayed in the top-center of cards.",
                            "properties": {
                              "type": {
                                "type": "string",
                                "description": "Reference topLeft object for full set of parameters and requirements."
                              }
                            }
                          },
                          "bottomLeft": {
                            "type": "object",
                            "properties": {
                              "type": {
                                "type": "string",
                                "description": "Reference topLeft object for full set of parameters and requirements."
                              }
                            },
                            "description": "Same structure as topLeft. Content displayed in the top-center of cards."
                          },
                          "bottomCenter": {
                            "type": "object",
                            "properties": {
                              "type": {
                                "type": "string",
                                "description": "Reference topLeft object for full set of parameters and requirements."
                              }
                            },
                            "description": "Same structure as topLeft. Content displayed in the top-center of cards."
                          },
                          "bottomRight": {
                            "type": "object",
                            "properties": {
                              "type": {
                                "type": "string",
                                "description": "Reference topLeft object for full set of parameters and requirements."
                              }
                            },
                            "description": "Same structure as topLeft. Content displayed in the top-center of cards."
                          },
                          "hideFromFirstCard": {
                            "type": "boolean",
                            "description": "Option to hide header and footer content from the first card.",
                            "default": ""
                          },
                          "hideFromLastCard": {
                            "type": "boolean",
                            "default": "",
                            "description": "Option to hide header and footer content from the last card."
                          }
                        },
                        "description": "Content displayed in the header and footer of your gamma."
                      }
                    },
                    "description": "Attributes of the cards you want to generate. Related to the format parameter."
                  },
                  "sharingOptions": {
                    "type": "object",
                    "description": "Determines how your gamma is shared with others.",
                    "properties": {
                      "workspaceAccess": {
                        "type": "string",
                        "description": "Level of access to your gamma for members in your workspace.",
                        "enum": [
                          "noAccess",
                          "view",
                          "comment",
                          "edit",
                          "fullAccess"
                        ]
                      },
                      "externalAccess": {
                        "type": "string",
                        "description": "Level of access to your gamma for members outside your workspace. Options: noAccess, view, comment, edit. If nothing specified, defaults to workspace share setting.",
                        "enum": [
                          "noAccess",
                          "view",
                          "comment",
                          "edit"
                        ]
                      },
                      "emailOptions": {
                        "type": "object",
                        "properties": {
                          "recipients": {
                            "type": "array",
                            "items": {
                              "type": "string"
                            },
                            "description": "Share with people via email."
                          },
                          "access": {
                            "type": "string",
                            "description": "Level of access to your gamma for those you share with via email. Options: view, comment, edit, fullAccess.",
                            "enum": [
                              "view",
                              "comment",
                              "edit",
                              "fullAccess"
                            ]
                          }
                        }
                      }
                    }
                  }
                },
                "type": "object",
                "required": [
                  "inputText",
                  "textMode"
                ]
              }
            }
          }
        }
      }
    }
  }
}

Receive generated file URLs

# Receive generated file URLs

Once you've sent a successful generation request using the Generate or Create from Template endpoints, you can use this GET Generation endpoint to:

* Poll for the status of your request. Polling at \~5 second intervals is recommended.
* Receive the URL to your generated gamma, which is further editable in Gamma.
* Receive a URL to a PDF or PPTX file, if you requested this file format via the API.
* Generated gammas appear in a separate tab in your dashboard. This tab appears only after you have successfully created at least one gamma using the API.

<Image align="center" border={false} width="200px" src="https://files.readme.io/17465dfe3d8eb94935056596e8595f977aaf031ceb4488d060f310a3bb06abbe-CleanShot_2025-10-01_at_07.49.492x.png" />

<Callout icon="ℹ️" theme="info">
  Note: If you requested to receive a PDF or PPTx file via the API, you will only be able to receive this file via the GET endpoint. These will not save to your in-app dashboard.
</Callout>

# OpenAPI definition

```json
{
  "openapi": "3.0.0",
  "info": {
    "version": "1.0.0",
    "title": "Generate"
  },
  "servers": [
    {
      "url": "https://public-api.gamma.app"
    }
  ],
  "paths": {
    "/v1.0/generations/{generationId}": {
      "get": {
        "description": "",
        "operationId": "get_v0.2generations{generationId}",
        "responses": {
          "200": {
            "description": "",
            "content": {
              "application/json": {
                "examples": {
                  "Status: Complete": {
                    "summary": "Status: Complete",
                    "value": {
                      "generationId": "XXXXXXXXXXX",
                      "status": "completed",
                      "gammaUrl": "https://gamma.app/docs/yyyyyyyyyy",
                      "credits": {
                        "deducted": 150,
                        "remaining": 3000
                      }
                    }
                  },
                  "Status: Pending": {
                    "summary": "Status: Pending",
                    "value": {
                      "status": "pending",
                      "generationId": "XXXXXXXXXXX"
                    }
                  },
                  "Status: Failed": {
                    "summary": "Status: Failed",
                    "value": {
                      "generationId": "XXXXXXXXXXX",
                      "status": "failed",
                      "error": {
                        "message": "Failed to generate text. Check your inputs and try again.",
                        "statusCode": 422
                      }
                    }
                  }
                }
              }
            }
          },
          "404": {
            "description": "Not Found",
            "content": {
              "application/json": {
                "examples": {
                  "Generation not found": {
                    "value": {
                      "message": "Generation ID not found. generationId: xxxxxx",
                      "statusCode": 404,
                      "credits": {
                        "deducted": 0,
                        "remaining": 3000
                      }
                    },
                    "summary": "Generation not found"
                  }
                }
              }
            }
          }
        },
        "parameters": [
          {
            "name": "generationId",
            "in": "path",
            "required": true,
            "description": "Successful requests to the POST endpoint will return a generationId, which needs to be specified in the GET request. ",
            "schema": {
              "type": "string",
              "default": ""
            }
          },
          {
            "name": "X-API-KEY",
            "in": "header",
            "required": true,
            "description": "Your API key sk-gamma-xxxxxxxxxx",
            "schema": {
              "type": "string",
              "default": ""
            }
          }
        ]
      }
    }
  }
}
```