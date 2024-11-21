import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Body,
  Render,
  Param,
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AppService } from "./app.service";
import { AuthService } from "./auth/auth.service";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("")
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post("dsep/search")
  getCoursesFromFln(@Body() body: any) {
    return this.appService.getCoursesFromFlnV2(body);
  }

  // @Post("/new/dsep/search")
  // getCoursesFromFlnNew(@Body() body: any) {
  //   return this.appService.getCoursesFromFlnV2New(body);
  // }

  @Post("dsep/select")
  selectCourseV2(@Body() body: any) {
    return this.appService.handleSelectV2(body);
  }

  @Post("dsep/init")
  initCourseV2(@Body() body: any) {
    return this.appService.handleInitV2(body);
  }

  @Post("dsep/status")
  getStatus(@Body() body: any) {
    return this.appService.handleStatus(body);
  }

  @Post("/v2/dsep/status")
  getStatusV2(@Body() body: any) {
    return this.appService.handleStatusV2(body);
  }

  @Get("application/:item_id/:transaction_id")
  @Render("submit")
  getSubmitForm(
    @Param("item_id") item_id: string,
    @Param("transaction_id") transaction_id: string
  ) {
    console.log("xinput application item >> ", item_id);
    console.log("xinput application transaction_id >> ", transaction_id);
    return { item_id, transaction_id };
  }

  // @Post("application-init/:item_id/:transaction_id")
  // submitInitFormV2(
  //   @Body() body: any,
  //   @Param("item_id") item_id: any,
  //   @Param("transaction_id") transaction_id: string
  // ) {
  //   console.log(
  //     "xinput application submit for item  >> ",
  //     item_id,
  //     "transaction_id >> ",
  //     transaction_id
  //   );
  //   return this.appService.handleInitSubmitV2(item_id, transaction_id, body);
  // }

  // @Post("application-init/:item_id/:transaction_id")
  // @UseInterceptors(FileInterceptor("files")) // 'files' matches the form-data field name
  // submitInitFormV2(
  //   @Body() body: any,
  //   @UploadedFile() file: Express.Multer.File
  // ) {
  //   // Pass the file to the service
  //   return this.appService.handleInitSubmitV2(body, file);
  //}

  @Post("application-init")
  submitInitFormV2(@Body() body: any) {
    // Pass only the body to the service
    return this.appService.handleInitSubmitV2(body);
  }

  @Post("dsep/confirm")
  confirmCourseV2(@Body() body: any) {
    return this.appService.handleConfirmV2(body);
  }

  // @Post('dsep/rating')
  // giveRating(@Body() body: any) {
  //   console.log("rating api calling")
  //   return this.appService.handleRating(body);
  // }

  // @Get('feedback/:id')
  // @Render('feedback')
  // getFeedbackForm(@Param('id') id: string) {
  //   return {id};
  // }

  // @Post('/submit-feedback/:id')
  //  submitFeedback(@Body('description') description: string,@Param('id') id: string) {
  //  return this.appService.handleSubmit(description, id);
  // }
}
