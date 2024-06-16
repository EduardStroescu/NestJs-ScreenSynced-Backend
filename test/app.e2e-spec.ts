import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';
import { CreateUserDto } from 'src/auth/dto';
import { UpdateUserDto } from 'src/users/dto/UpdateUser.dto';
import { CreateBookmarkDto } from 'src/bookmarks/dto/CreateBookmark.dto';

describe('App E2E', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    app.setGlobalPrefix('api');
    await app.init();
    await app.listen(process.env.PORT);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl(`http://localhost:${process.env.PORT}/api`);
  });

  afterAll(() => app.close());

  describe('Auth', () => {
    const dto: CreateUserDto = {
      userName: 'testUser',
      password: '123',
    };
    describe('Registration', () => {
      it('should throw if username is empty', () => {
        return pactum
          .spec()
          .post(`/auth/register`)
          .withBody(dto.password)
          .expectStatus(400);
      });
      it('should throw if password is empty', () => {
        return pactum
          .spec()
          .post(`/auth/register`)
          .withBody(dto.userName)
          .expectStatus(400);
      });
      it('should throw if body is empty', () => {
        return pactum
          .spec()
          .post(`/auth/register`)
          .withBody({})
          .expectStatus(400);
      });
      it('should register successfully', () => {
        return pactum
          .spec()
          .post(`/auth/register`)
          .withBody(dto)
          .expectStatus(201);
      });
    });
    describe('Login', () => {
      it('should throw if username is empty', () => {
        return pactum
          .spec()
          .post(`/auth/login`)
          .withBody(dto.password)
          .expectStatus(400);
      });
      it('should throw if password is empty', () => {
        return pactum
          .spec()
          .post(`/auth/login`)
          .withBody(dto.userName)
          .expectStatus(400);
      });
      it('should throw if body is empty', () => {
        return pactum.spec().post(`/auth/login`).withBody({}).expectStatus(400);
      });
      it('should login successfully', () => {
        return pactum
          .spec()
          .post(`/auth/login`)
          .withBody(dto)
          .expectStatus(200)
          .stores('userAt', 'access_token');
      });
    });
  });
  describe('Users', () => {
    describe('Get Current User', () => {
      it('should get the current user', () => {
        return pactum
          .spec()
          .get(`/users/current-user`)
          .withHeaders({
            Authorization: `Bearer $S{userAt}`,
          })
          .expectStatus(200);
      });
    });
    describe('Edit User', () => {
      it("should edit current user's userName, displayName", () => {
        const dto: UpdateUserDto = {
          userName: 'John',
          displayName: 'Doe',
        };
        return pactum
          .spec()
          .patch(`/users/update-details`)
          .withBody(dto)
          .withHeaders({
            Authorization: `Bearer $S{userAt}`,
          })
          .expectStatus(200)
          .expectBodyContains(dto.userName)
          .expectBodyContains(dto.displayName);
      });
    });
  });
  describe('Bookmarks', () => {
    const dto: CreateBookmarkDto = {
      mediaId: 12,
      mediaType: 'movie',
    };

    describe('Get no Bookmarks', () => {
      it('should get an empty bookmarks array', () => {
        return pactum
          .spec()
          .get(`/bookmarks`)
          .withHeaders({
            Authorization: `Bearer $S{userAt}`,
          })
          .expectStatus(200)
          .expectBody([]);
      });
    });
    describe('Create Bookmark', () => {
      it('should create bookmark', () => {
        return pactum
          .spec()
          .post(`/bookmarks`)
          .withBody(dto)
          .withHeaders({
            Authorization: `Bearer $S{userAt}`,
          })
          .expectStatus(201)
          .expectBodyContains(dto.mediaId)
          .expectBodyContains(dto.mediaType)
          .stores('bookmarkId', 'id');
      });
    });
    describe('Get Bookmarks', () => {
      it("should get all the user's bookmarks", () => {
        return pactum
          .spec()
          .get(`/bookmarks`)
          .withHeaders({
            Authorization: `Bearer $S{userAt}`,
          })
          .expectStatus(200)
          .expectJsonLength(1);
      });
    });
    describe('Get Bookmark By Id', () => {
      it('should get a bookmark by id', () => {
        return pactum
          .spec()
          .get(`/bookmarks/$S{bookmarkId}`)
          .withHeaders({
            Authorization: `Bearer $S{userAt}`,
          })
          .expectStatus(200)
          .expectBodyContains(dto.mediaId)
          .expectBodyContains(dto.mediaType)
          .expectJsonMatch({ id: '$S{bookmarkId}' });
      });
    });
    describe('Delete Bookmark By Id', () => {
      it('should delete a bookmark by id', () => {
        return pactum
          .spec()
          .delete(`/bookmarks/$S{bookmarkId}`)
          .withHeaders({
            Authorization: `Bearer $S{userAt}`,
          })
          .expectStatus(200)
          .expectBodyContains({ message: 'Bookmark deleted' });
      });
    });
    describe('Get no Bookmarks after deletion', () => {
      it('should get an empty bookmarks array after delete', () => {
        return pactum
          .spec()
          .get(`/bookmarks`)
          .withHeaders({
            Authorization: `Bearer $S{userAt}`,
          })
          .expectStatus(200)
          .expectBody([]);
      });
    });
  });
});
